import { sql } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { characterId } = await req.json() as { characterId: string }
    await sql`
      UPDATE character_state
      SET kaichi_level = LEAST(kaichi_level + 1, 8)
      WHERE character_id = ${characterId}
    `
    return new Response(null, { status: 204 })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
