import { sql } from "@/lib/db"
import { parseQrBody } from "@/lib/qr-validation"

export async function GET() {
  const rows = await sql`SELECT * FROM qr_codes ORDER BY created_at DESC`
  return Response.json(rows)
}

export async function POST(req: Request) {
  try {
    const parsed = parseQrBody(await req.json())
    if (!parsed.ok) return new Response(parsed.error, { status: 400 })
    const body = parsed.value
    const id    = `QR${crypto.randomUUID()}`
    const token = `akn-${Array.from(crypto.getRandomValues(new Uint8Array(5))).map(b => b.toString(36).padStart(2,"0")).join("").slice(0,9)}`

    await sql`
      INSERT INTO qr_codes (id, token, label, target_type, target_id, points, validity, valid_until)
      VALUES (${id}, ${token}, ${body.label}, ${body.targetType}, ${body.targetId}, ${body.points}, ${body.validity}, ${body.validUntil ?? null})
    `
    return Response.json({ id, token })
  } catch (err) {
    console.error("[api/qr]", err)
    return new Response("Server error", { status: 500 })
  }
}
