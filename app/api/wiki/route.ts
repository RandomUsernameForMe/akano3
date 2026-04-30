import { sql } from "@/lib/db"
import { getActiveRunId } from "@/lib/runs"

export const dynamic = "force-dynamic"

// GET /api/wiki?characterId=X  — filtered by character's kaichi level
// GET /api/wiki?admin=1         — all articles (GM use)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const admin = searchParams.get("admin") === "1"
    const characterId = searchParams.get("characterId")

    if (admin) {
      const rows = await sql`
        SELECT * FROM wiki_articles ORDER BY category, sort_order, id
      `
      return Response.json(rows)
    }

    if (!characterId) {
      return new Response("characterId required", { status: 400 })
    }

    const runId = await getActiveRunId()
    const [state] = await sql`
      SELECT kaichi_level FROM character_state
      WHERE character_id = ${characterId} AND run_id = ${runId}
    `
    const kaichiLevel = (state?.kaichi_level as number) ?? 0

    const rows = await sql`
      SELECT * FROM wiki_articles
      WHERE kaichi_required <= ${kaichiLevel}
      ORDER BY category, sort_order, id
    `
    return Response.json(rows)
  } catch (err) {
    console.error("[wiki GET]", err)
    return new Response(String(err), { status: 500 })
  }
}

// POST /api/wiki — create article
export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      slug: string; title: string; content: string
      category: string; kaichiRequired: number; sortOrder: number
    }
    const [row] = await sql`
      INSERT INTO wiki_articles (slug, title, content, category, kaichi_required, sort_order)
      VALUES (${body.slug}, ${body.title}, ${body.content}, ${body.category}, ${body.kaichiRequired}, ${body.sortOrder})
      RETURNING *
    `
    return Response.json(row, { status: 201 })
  } catch (err) {
    console.error("[wiki POST]", err)
    return new Response(String(err), { status: 500 })
  }
}
