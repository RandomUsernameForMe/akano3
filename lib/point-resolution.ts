import { UNITS, CIRCLES, CHARACTERS } from "./data.ts"

// Characters that hold points (students + the Růže).
const POINT_CHARS = CHARACTERS.filter(c => c.role === "student" || c.role === "ruze")
const CHAR_TEAM: Record<string, string> = Object.fromEntries(
  POINT_CHARS.filter(c => c.teamId).map(c => [c.id, c.teamId as string])
)

export function teamMemberIds(teamId: string): string[] {
  return POINT_CHARS.filter(c => c.teamId === teamId).map(c => c.id)
}

// Resolve a point target to the individual characters who receive the points.
// Group targets (team/unit/circle) fan out — each member gets the full amount.
export function resolveTargetCharacters(
  targetType: "team" | "unit" | "circle" | "student",
  targetId: string
): string[] {
  if (targetType === "student") return CHAR_TEAM[targetId] ? [targetId] : []
  if (targetType === "team") return teamMemberIds(targetId)
  if (targetType === "unit") {
    const u = UNITS.find(u => u.id === targetId)
    return u ? u.teamIds.flatMap(teamMemberIds) : []
  }
  const c = CIRCLES.find(c => c.id === targetId)
  return c ? c.memberIds.filter(id => CHAR_TEAM[id]) : []
}

export function charTeam(id: string): string | undefined { return CHAR_TEAM[id] }

export function teamsOfChars(charIds: string[]): string[] {
  return [...new Set(charIds.map(id => CHAR_TEAM[id]).filter(Boolean) as string[])]
}

// Which characters an entry credited. Falls back to expanding team targets for
// legacy rows written before individual points existed.
export function resolvedCharsOf(entry: { resolvedCharacterIds?: string[]; resolvedTeamIds: string[] }): string[] {
  if (entry.resolvedCharacterIds?.length) return entry.resolvedCharacterIds
  return entry.resolvedTeamIds.flatMap(teamMemberIds)
}

// Per-team point delta of a log entry, matching the era it was written in:
//  - new (per-student) entries: amount × (# credited chars in the team)
//  - legacy (team/unit/circle) entries: amount once per resolved team, since
//    the historical team totals accumulated under the old team-level semantics.
export function teamDeltaOf(entry: { resolvedCharacterIds?: string[]; resolvedTeamIds: string[]; amount: number }): Record<string, number> {
  const d: Record<string, number> = {}
  if (entry.resolvedCharacterIds?.length) {
    for (const cid of entry.resolvedCharacterIds) { const t = CHAR_TEAM[cid]; if (t) d[t] = (d[t] ?? 0) + entry.amount }
  } else {
    for (const t of entry.resolvedTeamIds) d[t] = (d[t] ?? 0) + entry.amount
  }
  return d
}
