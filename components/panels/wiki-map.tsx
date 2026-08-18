"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { computeHulls, createSimulation, wrapTitle, type MapLayout, type SimNode } from "@/lib/wiki-map-layout"
import type { WikiLink } from "@/lib/types"
import type { Simulation } from "d3-force"

// 7 pevných odstínů pro obálky shluků — nízká sytost, funguje ve světlém i tmavém tématu
const HULL_HUES = [210, 30, 120, 275, 350, 170, 55]

interface Props {
  layout: MapLayout
  links: WikiLink[]
  selectedSlug: string | null
  onSelect: (slug: string) => void
  matchedSlugs: Set<string>
  queryActive: boolean
}

export function WikiMap({ layout, links, selectedSlug, onSelect, matchedSlugs, queryActive }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 })
  const [nodes, setNodes] = useState<SimNode[]>([])
  const [hovered, setHovered] = useState<string | null>(null)
  const pan = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null)
  const nodeDrag = useRef<{ slug: string; startX: number; startY: number; moved: boolean } | null>(null)
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null)

  // Živá simulace: startuje z usazeného layoutu, tahání uzlu ji rozehřeje.
  useEffect(() => {
    const simNodes: SimNode[] = layout.nodes.map(n => ({ ...n }))
    const sim = createSimulation(simNodes, links)
      .alpha(0).alphaDecay(0.03)
      .on("tick", () => setNodes([...simNodes]))
      .stop()
    simRef.current = sim
    setNodes(simNodes)
    // krátké dosednutí při otevření, ať je vidět, že mapa žije
    sim.alpha(0.15).restart()
    return () => { sim.stop() }
  }, [layout, links])

  const pos = useMemo(() => new Map(nodes.map(n => [n.slug, n])), [nodes])
  const hulls = useMemo(() => (nodes.length ? computeHulls(nodes) : []), [nodes])
  const hullHue = useMemo(() => {
    const cats = [...new Set(layout.nodes.map(n => n.category))]
    return new Map(cats.map((c, i) => [c, HULL_HUES[i % HULL_HUES.length]]))
  }, [layout])

  // převod z px prohlížeče do jednotek viewBoxu
  function toViewUnits(clientX: number, clientY: number) {
    const rect = svgRef.current!.getBoundingClientRect()
    const scale = Math.min(rect.width / layout.width, rect.height / layout.height)
    const ox = (rect.width - layout.width * scale) / 2
    const oy = (rect.height - layout.height * scale) / 2
    return {
      x: (clientX - rect.left - ox) / scale,
      y: (clientY - rect.top - oy) / scale,
    }
  }
  // z jednotek viewBoxu do souřadnic světa (pod pan/zoom transformací)
  function toWorld(clientX: number, clientY: number) {
    const p = toViewUnits(clientX, clientY)
    return { x: (p.x - view.tx) / view.scale, y: (p.y - view.ty) / view.scale }
  }

  // wheel zoom ručním listenerem — Reactí onWheel je pasivní a preventDefault nefunguje
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const p = toViewUnits(e.clientX, e.clientY)
      setView(v => {
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
        const scale = Math.min(4, Math.max(0.4, v.scale * factor))
        const k = scale / v.scale
        // bod pod kurzorem zůstane pod kurzorem
        return { scale, tx: p.x - k * (p.x - v.tx), ty: p.y - k * (p.y - v.ty) }
      })
    }
    svg.addEventListener("wheel", onWheel, { passive: false })
    return () => svg.removeEventListener("wheel", onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.width, layout.height])

  function startNodeDrag(slug: string, e: React.PointerEvent) {
    e.stopPropagation()
    nodeDrag.current = { slug, startX: e.clientX, startY: e.clientY, moved: false }
    svgRef.current?.setPointerCapture(e.pointerId)
    const sim = simRef.current
    if (sim) sim.alphaTarget(0.25).restart()
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const p = toViewUnits(e.clientX, e.clientY)
    pan.current = { px: p.x, py: p.y, tx: view.tx, ty: view.ty }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const drag = nodeDrag.current
    if (drag) {
      if (!drag.moved && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 4) return
      const w = toWorld(e.clientX, e.clientY)
      const n = pos.get(drag.slug)
      if (n) { n.fx = w.x; n.fy = w.y; drag.moved = true }
      return
    }
    const d = pan.current
    if (!d) return
    const p = toViewUnits(e.clientX, e.clientY)
    setView(v => ({ ...v, tx: d.tx + (p.x - d.px), ty: d.ty + (p.y - d.py) }))
  }

  function onPointerUp() {
    const drag = nodeDrag.current
    if (drag) {
      const n = pos.get(drag.slug)
      if (n) { n.fx = null; n.fy = null }
      simRef.current?.alphaTarget(0)
      if (!drag.moved) onSelect(drag.slug)
      nodeDrag.current = null
    }
    pan.current = null
  }

  const touches = (l: WikiLink, slug: string | null) =>
    slug !== null && (l.fromSlug === slug || l.toSlug === slug)

  return (
    <div style={{
      backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
      borderRadius:6, boxShadow:"var(--shadow-print-sm)", overflow:"hidden",
    }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{ display:"block", width:"100%", height:640, cursor:"grab", touchAction:"none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <g transform={`translate(${view.tx},${view.ty}) scale(${view.scale})`}>
          {/* Obálky shluků — žijí s uzly */}
          {hulls.map(h => {
            const hue = hullHue.get(h.category) ?? 210
            return (
              <g key={h.category} pointerEvents="none">
                <rect
                  x={h.x} y={h.y} width={h.width} height={h.height} rx={24}
                  fill={`hsla(${hue}, 45%, 50%, 0.09)`}
                  stroke={`hsla(${hue}, 45%, 50%, 0.35)`}
                  strokeWidth={1.5}
                />
                <text
                  x={h.x + 16} y={h.y + 24}
                  style={{ fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}
                  fill="var(--c-text-muted)"
                >
                  {h.category}
                </text>
              </g>
            )
          })}

          {/* Hrany */}
          {links.map((l, i) => {
            const a = pos.get(l.fromSlug), b = pos.get(l.toSlug)
            if (!a || !b) return null
            const active = touches(l, selectedSlug) || touches(l, hovered)
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
            return (
              <g key={i} pointerEvents="none">
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={l.locked ? "#d4a017" : active ? "var(--c-accent)" : "var(--c-border-mid)"}
                  strokeWidth={active ? 2.5 : 1.5}
                  strokeDasharray={l.locked ? "6 4" : undefined}
                  opacity={active ? 1 : 0.7}
                />
                {/* Slovní popisky hran jsou jen ve čtecím panelu; v mapě zůstává jen značka tajemství. */}
                {l.locked && (
                  <text
                    x={mx} y={my - 5} textAnchor="middle"
                    style={{ fontSize:11, fontFamily:"monospace", paintOrder:"stroke" }}
                    fill="#d4a017"
                    stroke="var(--c-bg-card)" strokeWidth={4}
                  >
                    ███
                  </text>
                )}
              </g>
            )
          })}

          {/* Uzly */}
          {nodes.map(n => {
            const dimmed = queryActive && !matchedSlugs.has(n.slug)
            const selected = n.slug === selectedSlug
            const isHovered = n.slug === hovered
            const lines = wrapTitle(n.title)
            return (
              <g
                key={n.slug}
                onPointerDown={e => startNodeDrag(n.slug, e)}
                onMouseEnter={() => setHovered(n.slug)}
                onMouseLeave={() => setHovered(h => (h === n.slug ? null : h))}
                style={{ cursor:"pointer" }}
                opacity={dimmed ? 0.2 : 1}
              >
                <circle
                  cx={n.x} cy={n.y} r={isHovered ? n.r * 1.2 : n.r}
                  fill={selected ? "var(--c-bg-section)" : "var(--c-bg-card)"}
                  stroke={selected || isHovered ? "var(--c-accent)" : "var(--c-text)"}
                  strokeWidth={selected ? 3 : 2}
                  style={{ transition:"r 120ms" }}
                />
                <text
                  x={n.x} y={n.y + n.r + 15} textAnchor="middle"
                  style={{ fontSize:12.5, fontWeight:600, paintOrder:"stroke" }}
                  fill="var(--c-text)" stroke="var(--c-bg-card)" strokeWidth={4}
                >
                  {lines.map((line, li) => (
                    <tspan key={li} x={n.x} dy={li === 0 ? 0 : 14}>{line}</tspan>
                  ))}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
