import { sql } from "@/lib/db"
import { ALARM_COLORS } from "@/lib/constants"
import type { AlarmState } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const body = await req.json() as { action: "trigger" | "dismiss"; type?: AlarmState["type"]; message?: string }

    if (body.action === "dismiss") {
      await sql`UPDATE alarm_state SET active = false, updated_at = NOW() WHERE id = 1`
    } else if (body.action === "trigger" && body.type) {
      const color = ALARM_COLORS[body.type]
      await sql`
        UPDATE alarm_state
        SET active = true, type = ${body.type}, message = ${body.message ?? ""}, color = ${color}, updated_at = NOW()
        WHERE id = 1
      `
    } else {
      return new Response("Bad request", { status: 400 })
    }

    return new Response(null, { status: 204 })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
