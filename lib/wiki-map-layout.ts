import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force"
import type { WikiArticle, WikiLink } from "@/lib/types"

export interface MapNode { slug: string; title: string; category: string; x: number; y: number; r: number }
export interface MapHull { category: string; x: number; y: number; width: number; height: number }
export interface MapLayout { nodes: MapNode[]; hulls: MapHull[]; width: number; height: number }

// Jediný ručně laděný vstup mapy: středy shluků kategorií (souřadnice ~1000×840 plátna).
export const CLUSTER_CENTERS: Record<string, { x: number; y: number }> = {
  "Akano3":           { x: 500, y: 330 },
  "Lovci":            { x: 810, y: 200 },
  "Historie":         { x: 190, y: 190 },
  "Svět":             { x: 170, y: 520 },
  "Řád a společnost": { x: 470, y: 650 },
  "Monstra":          { x: 830, y: 620 },
  "Junkin":           { x: 860, y: 410 },
}
const FALLBACK_CENTER = { x: 500, y: 420 }
const HULL_PADDING = 34

type SimNode = MapNode & { index?: number; vx?: number; vy?: number }

export function computeLayout(
  articles: Pick<WikiArticle, "slug" | "title" | "category">[],
  links: WikiLink[],
): MapLayout {
  if (articles.length === 0) return { nodes: [], hulls: [], width: 1000, height: 840 }

  const degree = new Map<string, number>()
  for (const l of links) {
    degree.set(l.fromSlug, (degree.get(l.fromSlug) ?? 0) + 1)
    degree.set(l.toSlug,   (degree.get(l.toSlug)   ?? 0) + 1)
  }

  const nodes: SimNode[] = articles.map((a, i) => {
    const c = CLUSTER_CENTERS[a.category] ?? FALLBACK_CENTER
    return {
      slug: a.slug, title: a.title, category: a.category,
      // deterministický rozptyl výchozích pozic — simulace pak nesahá po náhodě
      x: c.x + 60 * Math.cos(i * 2.4), y: c.y + 60 * Math.sin(i * 2.4),
      r: Math.min(20, 9 + 2 * (degree.get(a.slug) ?? 0)),
    }
  })
  const bySlug = new Set(nodes.map(n => n.slug))
  const simLinks = links
    .filter(l => bySlug.has(l.fromSlug) && bySlug.has(l.toSlug))
    .map(l => ({ source: l.fromSlug, target: l.toSlug }))

  forceSimulation(nodes)
    .force("link", forceLink<SimNode, { source: string; target: string }>(simLinks)
      .id(n => n.slug).distance(80).strength(0.25))
    .force("charge", forceManyBody().strength(-160))
    .force("x", forceX<SimNode>(n => (CLUSTER_CENTERS[n.category] ?? FALLBACK_CENTER).x).strength(0.22))
    .force("y", forceY<SimNode>(n => (CLUSTER_CENTERS[n.category] ?? FALLBACK_CENTER).y).strength(0.22))
    .force("collide", forceCollide<SimNode>(n => n.r + 16))
    .stop()
    .tick(300)

  const hulls: MapHull[] = [...new Set(nodes.map(n => n.category))].map(cat => {
    const ns = nodes.filter(n => n.category === cat)
    const minX = Math.min(...ns.map(n => n.x - n.r)), maxX = Math.max(...ns.map(n => n.x + n.r))
    const minY = Math.min(...ns.map(n => n.y - n.r)), maxY = Math.max(...ns.map(n => n.y + n.r))
    return {
      category: cat,
      x: minX - HULL_PADDING, y: minY - HULL_PADDING,
      width: maxX - minX + 2 * HULL_PADDING, height: maxY - minY + 2 * HULL_PADDING,
    }
  })

  const minHX = Math.min(...hulls.map(h => h.x)),           minHY = Math.min(...hulls.map(h => h.y))
  const maxHX = Math.max(...hulls.map(h => h.x + h.width)), maxHY = Math.max(...hulls.map(h => h.y + h.height))
  // posuň vše do kladných souřadnic s okrajem 20
  const dx = 20 - minHX, dy = 20 - minHY
  for (const n of nodes) { n.x += dx; n.y += dy }
  for (const h of hulls) { h.x += dx; h.y += dy }

  return { nodes, hulls, width: maxHX - minHX + 40, height: maxHY - minHY + 40 }
}
