import { sql } from "@/lib/db"
import { INITIAL_POINT_LOG, TEAMS } from "@/lib/data"

export const dynamic = "force-dynamic"

// Seed mock point data for run 1.
// Resets point_log and team_points for run 1, then inserts INITIAL_POINT_LOG.
export async function POST() {
  try {
    const runId = 1

    // Recalculate team totals from mock log
    const teamTotals: Record<string, number> = {}
    for (const team of TEAMS) teamTotals[team.id] = 0
    for (const entry of INITIAL_POINT_LOG) {
      for (const teamId of entry.resolvedTeamIds) {
        teamTotals[teamId] = (teamTotals[teamId] ?? 0) + entry.amount
      }
    }

    await sql.transaction([
      sql`DELETE FROM point_log    WHERE run_id = ${runId}`,
      sql`DELETE FROM team_points  WHERE run_id = ${runId}`,
      ...INITIAL_POINT_LOG.map(e =>
        sql`
          INSERT INTO point_log
            (id, run_id, source_role, source_character_id, target_type, target_id,
             resolved_team_ids, amount, action_type, note, created_at)
          VALUES
            (${e.id}, ${runId}, ${e.sourceRole}, ${e.sourceCharacterId},
             ${e.targetType}, ${e.targetId}, ${e.resolvedTeamIds},
             ${e.amount}, ${e.actionType}, ${e.note ?? null}, ${e.timestamp.toISOString()})
        `
      ),
      ...Object.entries(teamTotals).map(([teamId, points]) =>
        sql`
          INSERT INTO team_points (team_id, run_id, points)
          VALUES (${teamId}, ${runId}, ${points})
        `
      ),
    ])

    return Response.json({ ok: true, seeded: INITIAL_POINT_LOG.length, teams: teamTotals })
  } catch (err) {
    console.error("[admin/seed]", err)
    return new Response(String(err), { status: 500 })
  }
}
