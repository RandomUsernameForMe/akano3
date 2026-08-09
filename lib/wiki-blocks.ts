// Parser pro custom fence bloky v markdownu knihovny.
// `:::kN … :::` označuje tajemství — skryté pod úrovní N, zobrazené od N výš.
// `:::reviseN … :::` označuje revizi — vyšší úroveň prohlašuje, že předchozí blok byl lež.

/**
 * Bloky drží pořadí, ve kterém byly v textu. Revidovaný blok (ten s
 * `revisedAtLevel`) a jeho `revision` blok spolu souvisí *výhradně* tím,
 * že jsou v poli bezprostředně vedle sebe — typ to nevynucuje. Kdo pole
 * filtruje, řadí nebo přeskupuje, tuhle vazbu rozbije a nic ho nevaruje.
 */
export type Block =
  | { type: "md"; lines: string[]; revisedAtLevel?: number }
  | { type: "secret"; requiredLevel: number; lines: string[]; revisedAtLevel?: number }
  | { type: "revision"; requiredLevel: number; lines: string[] }

const FENCE = /^:::(k|revise)(\d+)\s*$/

/** Odštěpí poslední odstavec (souvislou skupinu neprázdných řádků na konci). */
function splitTrailingParagraph(lines: string[]): [string[], string[]] {
  let end = lines.length
  while (end > 0 && !lines[end - 1].trim()) end--
  if (end === 0) return [lines, []]
  let start = end
  while (start > 0 && lines[start - 1].trim()) start--
  return [lines.slice(0, start), lines.slice(start, end)]
}

export function parseBlocks(content: string): Block[] {
  const rawLines = content.split("\n")
  const blocks: Block[] = []
  let currentMd: string[] = []
  let i = 0

  const flushMd = () => {
    if (currentMd.length) {
      blocks.push({ type: "md", lines: currentMd })
      currentMd = []
    }
  }

  while (i < rawLines.length) {
    const match = rawLines[i].match(FENCE)
    if (match) {
      const kind = match[1]
      const requiredLevel = parseInt(match[2])
      // Prázdný řádek mezi dvěma fence bloky (typicky kvůli čitelnosti zdroje) by jinak
      // vytvořil vlastní prázdný md blok, na který by se revize omylem navázala místo
      // na skutečný předchozí obsah. Před :::reviseN ho tedy zahodíme, nikoli flushneme.
      if (kind === "revise" && currentMd.every(l => !l.trim())) {
        currentMd = []
      } else {
        flushMd()
      }
      const body: string[] = []
      i++
      while (i < rawLines.length && rawLines[i].trim() !== ":::") {
        body.push(rawLines[i])
        i++
      }
      if (kind === "k") {
        blocks.push({ type: "secret", requiredLevel, lines: body })
      } else {
        attachRevision(blocks, requiredLevel)
        blocks.push({ type: "revision", requiredLevel, lines: body })
      }
    } else {
      currentMd.push(rawLines[i])
    }
    i++
  }
  flushMd()
  return blocks
}

/** Označí předchozí blok jako revidovaný. U md bloku odštěpí poslední odstavec. */
function attachRevision(blocks: Block[], level: number): void {
  const prev = blocks[blocks.length - 1]
  if (!prev) return
  if (prev.type === "secret") {
    prev.revisedAtLevel = level
    return
  }
  if (prev.type !== "md") return
  const [head, tail] = splitTrailingParagraph(prev.lines)
  if (!tail.length) return
  if (head.length) {
    prev.lines = head
    blocks.push({ type: "md", lines: tail, revisedAtLevel: level })
  } else {
    prev.revisedAtLevel = level
  }
}
