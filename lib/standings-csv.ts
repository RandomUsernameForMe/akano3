import type { Team, Character, Unit, Circle } from "./types.ts"
import { unitPoints, circlePoints } from "./score-aggregation.ts"

type Row = { name: string; team?: string; points: number }

export function escapeCsv(value: string | number): string {
  const s = String(value)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function rank(rows: Row[]): { rank: number; row: Row }[] {
  const sorted = [...rows].sort((a, b) => b.points - a.points)
  return sorted.map((row, i) => {
    const first = sorted.findIndex(r => r.points === row.points)
    return { rank: first + 1, row }
  })
}

function section(title: string, header: string[], lines: (string | number)[][]): string {
  return [title, header.join(","), ...lines.map(l => l.map(escapeCsv).join(","))].join("\n")
}

export function buildStandingsCsv(input: {
  characters: Pick<Character, "name" | "role" | "teamId" | "circleIds" | "points">[]
  teams: Pick<Team, "id" | "name" | "unitId" | "points">[]
  units: Pick<Unit, "id" | "name">[]
  circles: Pick<Circle, "id" | "name">[]
}): string {
  const { characters, teams, units, circles } = input
  const teamName = (id?: string) => teams.find(t => t.id === id)?.name ?? ""
  const table = (title: string, nameHeader: string, rows: Row[], withTeam = false) =>
    section(
      title,
      ["Pořadí", nameHeader, ...(withTeam ? ["Tým"] : []), "Body"],
      rank(rows).map(({ rank: r, row }) => [r, row.name, ...(withTeam ? [row.team ?? ""] : []), row.points]),
    )

  return [
    table("Studenti", "Jméno",
      characters.filter(c => c.role === "student" || c.role === "ruze")
        .map(c => ({ name: c.name, team: teamName(c.teamId), points: c.points })), true),
    table("Týmy", "Tým", teams.map(t => ({ name: t.name, points: t.points }))),
    table("Jednotky", "Jednotka",
      units.map(u => ({ name: u.name, points: unitPoints(u.id, teams, characters) }))),
    table("Kruhy", "Kruh",
      circles.map(c => ({ name: c.name, points: circlePoints(c.id, characters) }))),
  ].join("\n\n") + "\n"
}
