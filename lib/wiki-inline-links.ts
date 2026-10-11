export type InlineSegment =
  | { type: "text"; text: string }
  | { type: "link"; slug: string; label: string }

const LINK_RE = /\[\[\s*([a-z0-9-]+)\s*(?:\|([^\]\n]*))?\]\]/g

/** Rozdělí text na prosté úseky a odkazy `[[slug]]` / `[[slug|text]]`. */
export function parseInlineLinks(text: string): InlineSegment[] {
  const out: InlineSegment[] = []
  let last = 0
  for (const m of text.matchAll(LINK_RE)) {
    if (m.index > last) out.push({ type: "text", text: text.slice(last, m.index) })
    out.push({ type: "link", slug: m[1], label: m[2]?.trim() || m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) })
  return out
}
