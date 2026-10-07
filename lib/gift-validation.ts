import type { Character } from "@/lib/types"

export function validateGift(
  fromId: string,
  toId: string,
  amount: number,
  characters: readonly Character[],
): string | null {
  if (!Number.isInteger(amount) || amount <= 0) return "Invalid amount"
  if (fromId === toId) return "Cannot gift to self"

  const from = characters.find(c => c.id === fromId)
  const to   = characters.find(c => c.id === toId)
  if (!from || !to?.teamId) return "Invalid characters"
  if (from.role !== "student" && from.role !== "ruze") return "Invalid giver"

  return null
}
