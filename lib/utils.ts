import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TEAMS, UNITS, CIRCLES, CHARACTERS } from "./data"
export { teamMemberIds, resolveTargetCharacters, charTeam, teamsOfChars, resolvedCharsOf, teamDeltaOf } from "./point-resolution"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ROMAN = ["","I","II","III","IV","V","VI","VII","VIII"]
export const romanNumeral = (n: number) => ROMAN[n] ?? String(n)

export function formatTime(d: Date) {
  return d.toLocaleTimeString("cs-CZ", { hour:"2-digit", minute:"2-digit" })
}
export function formatDateTime(d: Date) {
  return d.toLocaleString("cs-CZ", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })
}

// Random-weighted split of `total` into integer shares summing exactly to total.
// Rounding drift is folded into the last share. `weights` must be positive.
export function splitPointsWeighted(total: number, weights: number[]): number[] {
  if (weights.length === 0) return []
  const sum = weights.reduce((s, w) => s + w, 0)
  const shares = weights.map(w => Math.round(total * w / sum))
  shares[shares.length - 1] += total - shares.reduce((s, x) => s + x, 0)
  return shares
}

export function getTeamName(id: string)   { return TEAMS.find(t => t.id === id)?.name ?? id }
export function getUnitName(id: string)   { return UNITS.find(u => u.id === id)?.name ?? id }
export function getCircleName(id: string) { return CIRCLES.find(c => c.id === id)?.name ?? id }
export function getTargetName(type: "team" | "unit" | "circle" | "student", id: string) {
  if (type === "student") return getCharName(id)
  if (type === "team") return getTeamName(id)
  if (type === "unit") return getUnitName(id)
  return getCircleName(id)
}
export function getCharName(id: string) {
  return CHARACTERS.find(c => c.id === id)?.name ?? id
}
