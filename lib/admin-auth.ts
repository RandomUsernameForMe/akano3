import { timingSafeEqual } from "node:crypto"

/**
 * Sdílený token pro /api/admin/*. Tyhle routy přepisují a mažou celé tabulky
 * a nevolá je nic z appky, jen curl. Bez nastaveného ADMIN_TOKEN se neotevřou.
 *
 * Vrací Response při odmítnutí, null když je požadavek v pořádku.
 */
export function adminGuard(req: Request): Response | null {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return new Response("ADMIN_TOKEN není nastaven", { status: 503 })

  const got = Buffer.from(req.headers.get("x-admin-token") ?? "")
  const want = Buffer.from(expected)
  if (got.length !== want.length || !timingSafeEqual(got, want)) {
    return new Response("Unauthorized", { status: 401 })
  }
  return null
}
