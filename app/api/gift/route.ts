import { sql } from "@/lib/db"
import { CHARACTERS } from "@/lib/data"
import { getActiveRunId } from "@/lib/runs"
import { emitGameEvent } from "@/lib/event-bus"

export async function POST(req: Request) {
  let poolInsufficient = false
  try {
    const { fromId, toId, amount } = await req.json() as { fromId: string; toId: string; amount: number }
    const from = CHARACTERS.find(c => c.id === fromId)
    const to   = CHARACTERS.find(c => c.id === toId)
    if (!from || !to?.teamId) return new Response("Invalid characters", { status: 400 })

    const runId = await getActiveRunId()
    const id = `PE${crypto.randomUUID()}`

    // Atomicky odečti pool — vrátí prázdné pole pokud pool nestačí
    const poolRows = await sql`
      UPDATE character_state
      SET peer_point_pool = peer_point_pool - ${amount}
      WHERE character_id = ${fromId} AND run_id = ${runId} AND peer_point_pool >= ${amount}
      RETURNING character_id
    `
    if (poolRows.length === 0) { poolInsufficient = true; throw new Error("Insufficient pool") }

    await sql.transaction([
      sql`UPDATE team_points SET points = points + ${amount} WHERE team_id = ${to.teamId} AND run_id = ${runId}`,
      sql`
        INSERT INTO point_log (id, run_id, source_role, source_character_id, target_type, target_id, resolved_team_ids, amount, action_type, note)
        VALUES (${id}, ${runId}, 'student', ${fromId}, 'team', ${to.teamId}, ${[to.teamId]}, ${amount}, 'peer_gift', ${`Dar od ${from.name} pro ${to.name}`})
      `,
    ])

    emitGameEvent({ type: "state-changed" })
    return new Response(null, { status: 204 })
  } catch (err) {
    if (poolInsufficient) return new Response("Nedostatečný pool bodů", { status: 422 })
    console.error("[api/gift]", err)
    return new Response("Server error", { status: 500 })
  }
}
