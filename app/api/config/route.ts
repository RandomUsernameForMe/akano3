import { sql } from "@/lib/db"
import { getActiveRunId } from "@/lib/runs"

// GM-only: manage team→unit, circle members, specializations

export async function POST(req: Request) {
  try {
    const body = await req.json() as
      | { action: "setTeamUnit"; teamId: string; unitId: string }
      | { action: "setCircleMembers"; circleId: string; memberIds: string[] }
      | { action: "setSpecialization"; characterId: string; specialization: string | null }

    const runId = await getActiveRunId()

    if (body.action === "setTeamUnit") {
      await sql`UPDATE team_units SET unit_id = ${body.unitId} WHERE team_id = ${body.teamId} AND run_id = ${runId}`
    } else if (body.action === "setCircleMembers") {
      if (body.memberIds.length > 0) {
        await sql.transaction([
          sql`DELETE FROM circle_members WHERE circle_id = ${body.circleId} AND run_id = ${runId}`,
          sql`INSERT INTO circle_members (circle_id, character_id, run_id) SELECT ${body.circleId}, unnest(${body.memberIds}::text[]), ${runId}`,
        ])
      } else {
        await sql`DELETE FROM circle_members WHERE circle_id = ${body.circleId} AND run_id = ${runId}`
      }
    } else if (body.action === "setSpecialization") {
      await sql`UPDATE character_state SET specialization = ${body.specialization} WHERE character_id = ${body.characterId} AND run_id = ${runId}`
    } else {
      return new Response("Bad request", { status: 400 })
    }

    return new Response(null, { status: 204 })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
