"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { MapLayout } from "@/lib/wiki-map-layout"
import type { WikiLink } from "@/lib/types"

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
  const drag = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null)

  const pos = useMemo(() => new Map(layout.nodes.map(n => [n.slug, n])), [layout])

  // převod z px prohlížeče do jednotek viewBoxu
  function toViewUnits(clientX: number, clientY: number) {
    const rect = svgRef.current!.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (layout.width / rect.width),
      y: (clientY - rect.top) * (layout.height / rect.height),
    }
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

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const p = toViewUnits(e.clientX, e.clientY)
    drag.current = { px: p.x, py: p.y, tx: view.tx, ty: view.ty }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = drag.current
    if (!d) return
    const p = toViewUnits(e.clientX, e.clientY)
    setView(v => ({ ...v, tx: d.tx + (p.x - d.px), ty: d.ty + (p.y - d.py) }))
  }
  function onPointerUp() { drag.current = null }

  const touchesSelected = (l: WikiLink) =>
    selectedSlug !== null && (l.fromSlug === selectedSlug || l.toSlug === selectedSlug)

  return (
    <div style={{
      backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
      borderRadius:6, boxShadow:"var(--shadow-print-sm)", overflow:"hidden",
    }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{ display:"block", width:"100%", height:620, cursor: drag.current ? "grabbing" : "grab", touchAction:"none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <g transform={`translate(${view.tx},${view.ty}) scale(${view.scale})`}>
          {/* Obálky shluků */}
          {layout.hulls.map((h, i) => (
            <g key={h.category}>
              <rect
                x={h.x} y={h.y} width={h.width} height={h.height} rx={24}
                fill={`hsla(${HULL_HUES[i % HULL_HUES.length]}, 45%, 50%, 0.09)`}
                stroke={`hsla(${HULL_HUES[i % HULL_HUES.length]}, 45%, 50%, 0.35)`}
                strokeWidth={1.5}
              />
              <text
                x={h.x + 16} y={h.y + 26}
                style={{ fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}
                fill="var(--c-text-muted)"
              >
                {h.category}
              </text>
            </g>
          ))}

          {/* Hrany */}
          {links.map((l, i) => {
            const a = pos.get(l.fromSlug), b = pos.get(l.toSlug)
            if (!a || !b) return null
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
            const showLabel = l.locked || (touchesSelected(l) && l.label)
            return (
              <g key={i}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={l.locked ? "#d4a017" : "var(--c-border-mid)"}
                  strokeWidth={touchesSelected(l) ? 2.5 : 1.5}
                  strokeDasharray={l.locked ? "6 4" : undefined}
                  opacity={0.85}
                />
                {showLabel && (
                  <text
                    x={mx} y={my - 5} textAnchor="middle"
                    style={{ fontSize:11, fontFamily: l.locked ? "monospace" : undefined, paintOrder:"stroke" }}
                    fill={l.locked ? "#d4a017" : "var(--c-text-muted)"}
                    stroke="var(--c-bg-card)" strokeWidth={4}
                  >
                    {l.locked ? "███" : l.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Uzly */}
          {layout.nodes.map(n => {
            const dimmed = queryActive && !matchedSlugs.has(n.slug)
            const selected = n.slug === selectedSlug
            return (
              <g
                key={n.slug}
                onClick={() => onSelect(n.slug)}
                style={{ cursor:"pointer" }}
                opacity={dimmed ? 0.2 : 1}
              >
                <circle
                  cx={n.x} cy={n.y} r={n.r}
                  fill={selected ? "var(--c-bg-section)" : "var(--c-bg-card)"}
                  stroke={selected ? "var(--c-accent)" : "var(--c-text)"}
                  strokeWidth={selected ? 3 : 2}
                />
                <text
                  x={n.x} y={n.y + n.r + 15} textAnchor="middle"
                  style={{ fontSize:12.5, fontWeight:600, paintOrder:"stroke" }}
                  fill="var(--c-text)" stroke="var(--c-bg-card)" strokeWidth={4}
                >
                  {n.title.replace(/\s*\(.*\)\s*$/, "")}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
