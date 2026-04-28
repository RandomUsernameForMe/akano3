import { sql } from "@/lib/db"
import { CHARACTERS } from "@/lib/data"
import { getActiveRunId } from "@/lib/runs"

export async function POST(req: Request) {
  try {
    const { fromId, toId, amount } = await req.json() as { fromId: string; toId: string; amount: number }
    if (!Number.isInteger(amount) || amount <= 0) return new Response("Invalid amount", { status: 400 })

    const from = CHARACTERS.find(c => c.id === fromId)
    const to   = CHARACTERS.find(c => c.id === toId)
    if (!from || !to?.teamId) return new Response("Invalid characters", { status: 400 })

    const runId = await getActiveRunId()
    const id = `PE${crypto.randomUUID()}`

    // Atomická operace: odečti pool + přidej body týmu + zapiš log v jedné transakci
    // CTE zajistí že pool deduction a team_points update jsou nedělitelné
    const rows = await sql`
      WITH deduct AS (
        UPDATE character_state
        SET peer_point_pool = peer_point_pool - ${amount}
        WHERE character_id = ${fromId} AND run_id = ${runId} AND peer_point_pool >= ${amount}
        RETURNING character_id
      ),
      add_points AS (
        UPDATE team_points
        SET points = points + ${amount}
        WHERE team_id = ${to.teamId} AND run_id = ${runId}
          AND EXISTS (SELECT 1 FROM deduct)
        RETURNING team_id
      )
      INSERT INTO point_log (id, run_id, source_role, source_character_id, target_type, target_id, resolved_team_ids, amount, action_type, note)
      SELECT ${id}, ${runId}, 'student', ${fromId}, 'team', ${to.teamId}, ${[to.teamId]}, ${amount}, 'peer_gift', ${`Dar od ${from.name} pro ${to.name}`}
      WHERE EXISTS (SELECT 1 FROM deduct)
      RETURNING id
    `

    if (rows.length === 0) return new Response("Nedostatečný pool bodů", { status: 422 })

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error("[api/gift]", err)
    return new Response("Server error", { status: 500 })
  }
}
