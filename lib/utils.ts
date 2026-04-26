import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TEAMS, UNITS, CIRCLES, CHARACTERS } from "./data"

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

export function resolveTargetTeams(
  targetType: "team" | "unit" | "circle",
  targetId: string
): string[] {
  if (targetType === "team") return [targetId]
  if (targetType === "unit") {
    const u = UNITS.find(u => u.id === targetId)
    return u ? [...u.teamIds] : []
  }
  const c = CIRCLES.find(c => c.id === targetId)
  if (!c) return []
  return [...new Set(c.memberIds.map(mid => {
    const ch = CHARACTERS.find(ch => ch.id === mid)
    return ch?.teamId
  }).filter(Boolean) as string[])]
}

export function getTeamName(id: string)   { return TEAMS.find(t => t.id === id)?.name ?? id }
export function getUnitName(id: string)   { return UNITS.find(u => u.id === id)?.name ?? id }
export function getCircleName(id: string) { return CIRCLES.find(c => c.id === id)?.name ?? id }
export function getTargetName(type: "team" | "unit" | "circle", id: string) {
  if (type === "team") return getTeamName(id)
  if (type === "unit") return getUnitName(id)
  return getCircleName(id)
}
export function getCharName(id: string) {
  return CHARACTERS.find(c => c.id === id)?.name ?? id
}
