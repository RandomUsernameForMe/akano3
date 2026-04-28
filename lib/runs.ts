import { sql } from "@/lib/db"

export async function getActiveRunId(): Promise<number> {
  const [row] = await sql`SELECT id FROM runs WHERE is_active = TRUE LIMIT 1`
  if (!row) throw new Error("No active run")
  return row.id as number
}
