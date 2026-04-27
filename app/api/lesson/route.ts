import { sql } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json() as
      | { action: "toggle"; active: boolean; durationMin?: number }
      | { action: "claim"; characterId: string }

    if (body.action === "toggle") {
      const end = body.active
        ? new Date(Date.now() + (body.durationMin ?? 30) * 60000).toISOString()
        : null
      if (body.active) {
        await sql.transaction([
          sql`
            UPDATE game_config
            SET lesson_window_active = ${body.active}, lesson_window_end = ${end}, updated_at = NOW()
            WHERE id = 1
          `,
          sql`UPDATE character_state SET lesson_claimed_this_window = false`,
        ])
      } else {
        await sql`
          UPDATE game_config
          SET lesson_window_active = false, lesson_window_end = null, updated_at = NOW()
          WHERE id = 1
        `
      }
    } else if (body.action === "claim") {
      await sql`
        UPDATE character_state
        SET lesson_claimed_this_window = true
        WHERE character_id = ${body.characterId} AND lesson_claimed_this_window = false
      `
    } else {
      return new Response("Bad request", { status: 400 })
    }

    return new Response(null, { status: 204 })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
