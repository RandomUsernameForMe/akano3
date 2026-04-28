import { sql } from "@/lib/db"
import { getActiveRunId } from "@/lib/runs"
import { emitGameEvent } from "@/lib/event-bus"

export async function POST(req: Request) {
  try {
    const { characterId } = await req.json() as { characterId: string }
    const runId = await getActiveRunId()
    await sql`
      UPDATE character_state
      SET kaichi_level = LEAST(kaichi_level + 1, 8)
      WHERE character_id = ${characterId} AND run_id = ${runId}
    `
    emitGameEvent({ type: "state-changed" })
    return new Response(null, { status: 204 })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
