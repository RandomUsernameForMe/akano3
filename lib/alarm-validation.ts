import { ALARM_COLORS } from "./constants.ts"
import type { AlarmState } from "./types"

export const ALARM_MESSAGE_MAX = 500

export type AlarmCommand =
  | { action: "dismiss" }
  | { action: "trigger"; type: AlarmState["type"]; message: string }

export type AlarmParseResult = { ok: true; value: AlarmCommand } | { ok: false; error: string }

const fail = (error: string): AlarmParseResult => ({ ok: false, error })

export function parseAlarmBody(body: unknown): AlarmParseResult {
  if (typeof body !== "object" || body === null) return fail("Body must be an object")
  const { action, type, message } = body as Record<string, unknown>

  if (action === "dismiss") return { ok: true, value: { action: "dismiss" } }
  if (action !== "trigger") return fail("Unknown action")

  if (typeof type !== "string" || !Object.hasOwn(ALARM_COLORS, type)) return fail("Unknown alarm type")
  if (message !== undefined && typeof message !== "string") return fail("Message must be a string")
  if (message !== undefined && message.length > ALARM_MESSAGE_MAX) return fail("Message too long")

  return { ok: true, value: { action: "trigger", type: type as AlarmState["type"], message: message ?? "" } }
}
