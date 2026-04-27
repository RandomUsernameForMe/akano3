import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const [alarm, config, teamPoints, charState, circleMembers, teamUnits, pointLog, qrCodes] =
    await Promise.all([
      sql`SELECT * FROM alarm_state WHERE id = 1`,
      sql`SELECT * FROM game_config WHERE id = 1`,
      sql`SELECT team_id, points FROM team_points`,
      sql`SELECT character_id, kaichi_level, peer_point_pool, lesson_claimed_this_window, specialization FROM character_state`,
      sql`SELECT circle_id, character_id FROM circle_members`,
      sql`SELECT team_id, unit_id FROM team_units`,
      sql`SELECT * FROM point_log ORDER BY timestamp DESC LIMIT 200`,
      sql`SELECT * FROM qr_codes ORDER BY created_at DESC`,
    ])

  return Response.json({
    alarm: alarm[0],
    config: config[0],
    teamPoints,
    charState,
    circleMembers,
    teamUnits,
    pointLog,
    qrCodes,
  })
}
