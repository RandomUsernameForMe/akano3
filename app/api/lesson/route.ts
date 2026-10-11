import { sql } from "@/lib/db"
import { getActiveRunId } from "@/lib/runs"
import { CHARACTERS } from "@/lib/data"
import { parseDurationMin, validateLessonBody } from "@/lib/request-validation"

export async function POST(req: Request) {
  try {
    const raw: unknown = await req.json().catch(() => null)
    const error = validateLessonBody(raw, CHARACTERS.map(c => c.id))
    if (error) return new Response(error, { status: 400 })
    const body = raw as
      | { action: "toggle"; active: boolean; durationMin?: number }
      | { action: "claim"; characterId: string }

    const runId = await getActiveRunId()

    if (body.action === "toggle") {
      const end = body.active
        ? new Date(Date.now() + parseDurationMin(body.durationMin)! * 60000).toISOString()
        : null
      if (body.active) {
        await sql.transaction([
          sql`
            UPDATE game_config
            SET lesson_window_active = ${body.active}, lesson_window_end = ${end}, updated_at = NOW()
            WHERE run_id = ${runId}
          `,
          sql`UPDATE character_state SET lesson_claimed_this_window = false WHERE run_id = ${runId}`,
        ])
      } else {
        await sql`
          UPDATE game_config
          SET lesson_window_active = false, lesson_window_end = null, updated_at = NOW()
          WHERE run_id = ${runId}
        `
      }
    } else if (body.action === "claim") {
      await sql`
        UPDATE character_state
        SET lesson_claimed_this_window = true
        WHERE character_id = ${body.characterId} AND run_id = ${runId} AND lesson_claimed_this_window = false
      `
    } else {
      return new Response("Bad request", { status: 400 })
    }

    return new Response(null, { status: 204 })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
