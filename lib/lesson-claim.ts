export const LESSON_POINTS = 5

export type LessonClaimState = {
  windowActive: boolean
  windowEnd: Date | null
  alreadyClaimed: boolean
}

export function canClaimLesson({ windowActive, windowEnd, alreadyClaimed }: LessonClaimState, now: Date): boolean {
  if (!windowActive || alreadyClaimed || windowEnd === null) return false
  return windowEnd.getTime() > now.getTime()
}
