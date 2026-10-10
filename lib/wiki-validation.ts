export type WikiArticleInput = {
  slug: string; title: string; content: string
  category: string; kaichiRequired: number; sortOrder: number
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string }

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error })

const isNonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim() !== ""

export function validateWikiArticleInput(body: unknown): ValidationResult<WikiArticleInput> {
  if (typeof body !== "object" || body === null) return fail("Tělo požadavku musí být objekt")
  const b = body as Record<string, unknown>
  if (!isNonEmptyString(b.slug)) return fail("slug je povinný")
  if (!isNonEmptyString(b.title)) return fail("title je povinný")
  if (typeof b.content !== "string") return fail("content musí být text")
  if (typeof b.category !== "string") return fail("category musí být text")
  const k = b.kaichiRequired
  if (typeof k !== "number" || !Number.isInteger(k) || k < 0 || k > 8) {
    return fail("kaichiRequired musí být celé číslo 0–8")
  }
  const s = b.sortOrder
  if (typeof s !== "number" || !Number.isInteger(s)) return fail("sortOrder musí být celé číslo")
  return {
    ok: true,
    value: { slug: b.slug, title: b.title, content: b.content, category: b.category, kaichiRequired: k, sortOrder: s },
  }
}

// Celé číslo (nebo numerický string); hodnoty mimo 0–8 se ořežou.
export function parseKaichiLevel(value: unknown): ValidationResult<number> {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value
  if (typeof n !== "number" || !Number.isInteger(n)) return fail("level musí být celé číslo")
  return { ok: true, value: Math.max(0, Math.min(8, n)) }
}
