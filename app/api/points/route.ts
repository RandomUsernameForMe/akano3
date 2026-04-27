import { sql } from "@/lib/db"
import { resolveTargetTeams } from "@/lib/utils"
import { CHARACTERS } from "@/lib/data"
import type { PointEntry } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const body = await req.json() as Omit<PointEntry, "id" | "timestamp" | "resolvedTeamIds">

    let resolvedTeamIds: string[]
    if (body.targetType === "circle") {
      const rows = await sql`SELECT character_id FROM circle_members WHERE circle_id = ${body.targetId}`
      resolvedTeamIds = [...new Set(
        rows
          .map(r => CHARACTERS.find(c => c.id === r.character_id)?.teamId)
          .filter((id): id is string => !!id)
      )]
    } else {
      resolvedTeamIds = resolveTargetTeams(body.targetType, body.targetId)
    }

    const id = `PE${Date.now()}`

    await sql.transaction([
      sql`
        INSERT INTO point_log (id, source_role, source_character_id, target_type, target_id, resolved_team_ids, amount, action_type, note)
        VALUES (${id}, ${body.sourceRole}, ${body.sourceCharacterId}, ${body.targetType}, ${body.targetId}, ${resolvedTeamIds}, ${body.amount}, ${body.actionType}, ${body.note ?? null})
      `,
      ...resolvedTeamIds.map(teamId =>
        sql`UPDATE team_points SET points = points + ${body.amount} WHERE team_id = ${teamId}`
      ),
    ])

    return Response.json({ id, resolvedTeamIds })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
