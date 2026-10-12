import type { PointEntry } from "./types.ts"
import { resolvedCharsOf, isReversal, isReversed } from "./point-resolution.ts"

export type HistoryItem = {
  entry: PointEntry
  amount: number
  runningTotal: number
  reversed: boolean
  isReversal: boolean
}

// Entries that credited the character, newest first, with the running total
// accumulated up to and including each entry.
export function characterHistory(log: PointEntry[], characterId: string): HistoryItem[] {
  const mine = log
    .filter(e => resolvedCharsOf(e).includes(characterId))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  let total = 0
  return mine
    .map(entry => {
      total += entry.amount
      return {
        entry,
        amount: entry.amount,
        runningTotal: total,
        reversed: isReversed(entry, log),
        isReversal: isReversal(entry),
      }
    })
    .reverse()
}
