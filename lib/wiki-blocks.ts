// Parser pro custom fence bloky v markdownu knihovny.
// `:::kN … :::` označuje tajemství — skryté pod úrovní N, zobrazené od N výš.
// `:::reviseN … :::` označuje revizi — vyšší úroveň prohlašuje, že předchozí blok byl lež.

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
      flushMd()
      const kind = match[1]
      const requiredLevel = parseInt(match[2])
      const body: string[] = []
      i++
      while (i < rawLines.length && rawLines[i].trim() !== ":::") {
        body.push(rawLines[i])
        i++
      }
      if (kind === "k") {
        blocks.push({ type: "secret", requiredLevel, lines: body })
      } else {
        markPrevious(blocks, requiredLevel)
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
function markPrevious(blocks: Block[], level: number): void {
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
