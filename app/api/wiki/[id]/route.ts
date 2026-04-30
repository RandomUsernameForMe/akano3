import { sql } from "@/lib/db"

// PUT /api/wiki/[id] — update article
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json() as {
      slug: string; title: string; content: string
      category: string; kaichiRequired: number; sortOrder: number
    }
    const [row] = await sql`
      UPDATE wiki_articles SET
        slug = ${body.slug},
        title = ${body.title},
        content = ${body.content},
        category = ${body.category},
        kaichi_required = ${body.kaichiRequired},
        sort_order = ${body.sortOrder},
        updated_at = NOW()
      WHERE id = ${Number(id)}
      RETURNING *
    `
    if (!row) return new Response("Not found", { status: 404 })
    return Response.json(row)
  } catch (err) {
    console.error("[wiki PUT]", err)
    return new Response(String(err), { status: 500 })
  }
}

// DELETE /api/wiki/[id] — delete article
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await sql`DELETE FROM wiki_articles WHERE id = ${Number(id)}`
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error("[wiki DELETE]", err)
    return new Response(String(err), { status: 500 })
  }
}
