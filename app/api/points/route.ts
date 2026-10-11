import { sql } from "@/lib/db"
import { resolveTargetCharacters, teamsOfChars } from "@/lib/utils"
import type { RunMapping } from "@/lib/point-resolution"
import { getActiveRunId } from "@/lib/runs"
import type { PointEntry } from "@/lib/types"

async function loadRunMapping(targetType: string, runId: number): Promise<RunMapping | undefined> {
  if (targetType !== "unit" && targetType !== "circle") return undefined
  const [tuRows, cmRows] = await Promise.all([
    sql`SELECT team_id, unit_id FROM team_units WHERE run_id = ${runId}`,
    sql`SELECT circle_id, character_id FROM circle_members WHERE run_id = ${runId}`,
  ])
  const teamUnits: Record<string, string> = {}
  for (const r of tuRows) teamUnits[r.team_id] = r.unit_id
  const circleMembers: Record<string, string[]> = {}
  for (const r of cmRows) (circleMembers[r.circle_id] ??= []).push(r.character_id)
  return { teamUnits, circleMembers }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as Omit<PointEntry, "id" | "timestamp" | "resolvedTeamIds" | "resolvedCharacterIds">

    // Růže is limited to small nudges on individual students.
    // ponytail: role comes from the client (no session auth anywhere in this API) —
    // consistency guard, not security; real auth would need sessions.
    if (body.sourceRole === "ruze" && (body.targetType !== "student" || Math.abs(body.amount) > 5)) {
      return new Response("Ruze may only assign ±5 points to individual students", { status: 400 })
    }

    const runId = await getActiveRunId()

    const mapping = await loadRunMapping(body.targetType, runId)
    const resolvedCharacterIds = resolveTargetCharacters(body.targetType, body.targetId, mapping)
    const resolvedTeamIds = teamsOfChars(resolvedCharacterIds)

    const id = `PE${crypto.randomUUID()}`

    await sql.transaction([
      sql`
        INSERT INTO point_log (id, run_id, source_role, source_character_id, target_type, target_id, resolved_team_ids, resolved_character_ids, amount, action_type, note)
        VALUES (${id}, ${runId}, ${body.sourceRole}, ${body.sourceCharacterId}, ${body.targetType}, ${body.targetId}, ${resolvedTeamIds}, ${resolvedCharacterIds}, ${body.amount}, ${body.actionType}, ${body.note ?? null})
      `,
      ...resolvedCharacterIds.map(charId =>
        sql`UPDATE character_points SET points = points + ${body.amount} WHERE character_id = ${charId} AND run_id = ${runId}`
      ),
    ])

    return Response.json({ id, resolvedTeamIds, resolvedCharacterIds })
  } catch (err) {
    console.error("[api/points]", err)
    return new Response("Server error", { status: 500 })
  }
}
