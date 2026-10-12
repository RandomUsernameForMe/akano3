import { resolveTargetCharacters } from "./point-resolution.ts"
import type { QRCode } from "./types"

type TargetType = Parameters<typeof resolveTargetCharacters>[0]
type Validity = QRCode["validity"]

const TARGET_TYPES: readonly TargetType[] = ["team", "unit", "circle", "student"]
const VALIDITIES: readonly Validity[] = ["once", "timed", "repeat"]

export type QrInput = {
  label: string; targetType: TargetType; targetId: string
  points: number; validity: Validity; validUntil?: string
}

export type QrParseResult = { ok: true; value: QrInput } | { ok: false; error: string }

const fail = (error: string): QrParseResult => ({ ok: false, error })

export function parseQrBody(body: unknown): QrParseResult {
  if (typeof body !== "object" || body === null) return fail("Body must be an object")
  const { label, targetType, targetId, points, validity, validUntil } = body as Record<string, unknown>

  if (typeof label !== "string" || label.trim() === "") return fail("Label must be a non-empty string")
  if (typeof targetType !== "string" || !TARGET_TYPES.includes(targetType as TargetType)) return fail("Unknown targetType")
  if (typeof targetId !== "string" || resolveTargetCharacters(targetType as TargetType, targetId).length === 0) return fail("Unknown targetId")
  if (typeof points !== "number" || !Number.isInteger(points) || points === 0) return fail("Points must be a non-zero integer")
  if (typeof validity !== "string" || !VALIDITIES.includes(validity as Validity)) return fail("Unknown validity")
  if (validUntil != null && (typeof validUntil !== "string" || isNaN(Date.parse(validUntil)))) return fail("validUntil must be an ISO date")

  return {
    ok: true,
    value: {
      label: label.trim(), targetType: targetType as TargetType, targetId, points,
      validity: validity as Validity, ...(validUntil != null && { validUntil }),
    },
  }
}
