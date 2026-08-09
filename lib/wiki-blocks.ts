export type Block =
  | { type: "md"; lines: string[]; revisedAtLevel?: number }
  | { type: "secret"; requiredLevel: number; lines: string[]; revisedAtLevel?: number }
  | { type: "revision"; requiredLevel: number; lines: string[] }

export function parseBlocks(content: string): Block[] {
  const rawLines = content.split("\n")
  const blocks: Block[] = []
  let currentMd: string[] = []
  let i = 0

  while (i < rawLines.length) {
    const line = rawLines[i]
    const fenceMatch = line.match(/^:::k(\d+)\s*$/)
    if (fenceMatch) {
      if (currentMd.length) {
        blocks.push({ type: "md", lines: currentMd })
        currentMd = []
      }
      const requiredLevel = parseInt(fenceMatch[1])
      const secretLines: string[] = []
      i++
      while (i < rawLines.length && rawLines[i].trim() !== ":::") {
        secretLines.push(rawLines[i])
        i++
      }
      blocks.push({ type: "secret", requiredLevel, lines: secretLines })
    } else {
      currentMd.push(line)
    }
    i++
  }
  if (currentMd.length) blocks.push({ type: "md", lines: currentMd })
  return blocks
}
