import { sql } from "@/lib/db"
import { CHARACTERS } from "@/lib/data"

export async function POST(req: Request) {
  let poolInsufficient = false
  try {
    const { fromId, toId, amount } = await req.json() as { fromId: string; toId: string; amount: number }
    const from = CHARACTERS.find(c => c.id === fromId)
    const to   = CHARACTERS.find(c => c.id === toId)
    if (!from || !to?.teamId) return new Response("Invalid characters", { status: 400 })

    const id = `PE${Date.now()}`

    await sql.transaction(async (tx) => {
      const rows = await tx`
        UPDATE character_state
        SET peer_point_pool = peer_point_pool - ${amount}
        WHERE character_id = ${fromId} AND peer_point_pool >= ${amount}
        RETURNING character_id
      `
      if (rows.length === 0) { poolInsufficient = true; throw new Error("Insufficient pool") }
      await tx`UPDATE team_points SET points = points + ${amount} WHERE team_id = ${to.teamId}`
      await tx`
        INSERT INTO point_log (id, source_role, source_character_id, target_type, target_id, resolved_team_ids, amount, action_type, note)
        VALUES (${id}, 'student', ${fromId}, 'team', ${to.teamId}, ${[to.teamId]}, ${amount}, 'peer_gift', ${`Dar od ${from.name} pro ${to.name}`})
      `
    })

    return new Response(null, { status: 204 })
  } catch {
    if (poolInsufficient) return new Response("Nedostatečný pool bodů", { status: 422 })
    return new Response("Server error", { status: 500 })
  }
}
