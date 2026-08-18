import type { WikiLink } from "@/lib/types"

export interface RawLink {
  from_slug: string
  to_slug: string
  label: string
  kaichi_required: number
}

// Zamčená hrana jde ke klientovi bez labelu — hráč vidí, ŽE spojení existuje, ne JAKÉ.
export function gateLink(link: RawLink, kaichiLevel: number): WikiLink {
  const locked = link.kaichi_required > kaichiLevel
  return { fromSlug: link.from_slug, toSlug: link.to_slug, label: locked ? null : link.label, locked }
}

export function gateLinks(links: RawLink[], kaichiLevel: number, visibleSlugs: Set<string>): WikiLink[] {
  return links
    .filter(l => visibleSlugs.has(l.from_slug) && visibleSlugs.has(l.to_slug))
    .map(l => gateLink(l, kaichiLevel))
}

export function validateLinks(
  articleSlugs: Set<string>,
  links: { from_slug: string; to_slug: string }[],
): string[] {
  const bad: string[] = []
  for (const l of links) {
    if (!articleSlugs.has(l.from_slug)) bad.push(l.from_slug)
    if (!articleSlugs.has(l.to_slug)) bad.push(l.to_slug)
  }
  return bad
}
