import type { Team, Character } from "./types.ts"

export function unitPoints(
  unitId: string,
  teams: Pick<Team, "id" | "unitId">[],
  characters: Pick<Character, "teamId" | "points">[],
): number {
  const teamIds = new Set(teams.filter(t => t.unitId === unitId).map(t => t.id))
  return characters
    .filter(c => c.teamId && teamIds.has(c.teamId))
    .reduce((s, c) => s + c.points, 0)
}

export function circlePoints(
  circleId: string,
  characters: Pick<Character, "circleIds" | "points">[],
): number {
  return characters
    .filter(c => c.circleIds.includes(circleId))
    .reduce((s, c) => s + c.points, 0)
}
