export function searchNorm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function matchesQuery(a: { title: string; content: string }, query: string): boolean {
  const q = searchNorm(query.trim())
  if (!q) return true
  return searchNorm(a.title).includes(q) || searchNorm(a.content).includes(q)
}
