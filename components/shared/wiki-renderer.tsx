"use client"

import React from "react"
import { romanNumeral } from "@/lib/utils"
import { parseBlocks } from "@/lib/wiki-blocks"

interface Props {
  content: string
  kaichiLevel: number
}

function renderMdLine(line: string, idx: number): React.ReactNode {
  // Headings
  if (line.startsWith("### ")) return <h3 key={idx} style={{ fontSize:"1rem", fontWeight:800, color:"var(--c-text)", margin:"20px 0 6px" }}>{inline(line.slice(4))}</h3>
  if (line.startsWith("## "))  return <h2 key={idx} style={{ fontSize:"1.15rem", fontWeight:800, color:"var(--c-accent)", margin:"26px 0 8px", borderBottom:"1px solid var(--c-border)", paddingBottom:4 }}>{inline(line.slice(3))}</h2>
  if (line.startsWith("# "))   return <h1 key={idx} style={{ fontSize:"1.4rem", fontWeight:900, color:"var(--c-text)", margin:"0 0 14px" }}>{inline(line.slice(2))}</h1>
  // HR
  if (line.match(/^---+$/)) return <hr key={idx} style={{ border:"none", borderTop:"1px solid var(--c-border)", margin:"18px 0" }} />
  // Bullet list
  if (line.startsWith("- ") || line.startsWith("* ")) {
    return (
      <div key={idx} style={{ display:"flex", gap:8, margin:"3px 0", paddingLeft:8 }}>
        <span style={{ color:"var(--c-accent)", fontWeight:900, flexShrink:0, marginTop:2 }}>·</span>
        <span style={{ color:"var(--c-text)", fontSize:"0.9rem", lineHeight:1.65 }}>{inline(line.slice(2))}</span>
      </div>
    )
  }
  // Numbered list
  const numMatch = line.match(/^(\d+)\. (.+)$/)
  if (numMatch) {
    return (
      <div key={idx} style={{ display:"flex", gap:8, margin:"3px 0", paddingLeft:8 }}>
        <span style={{ color:"var(--c-accent)", fontWeight:700, flexShrink:0, minWidth:20, fontSize:"0.85rem" }}>{numMatch[1]}.</span>
        <span style={{ color:"var(--c-text)", fontSize:"0.9rem", lineHeight:1.65 }}>{inline(numMatch[2])}</span>
      </div>
    )
  }
  // Blockquote
  if (line.startsWith("> ")) {
    return (
      <div key={idx} style={{
        borderLeft:"3px solid var(--c-border-mid)", paddingLeft:14, margin:"8px 0",
        color:"var(--c-text-muted)", fontSize:"0.9rem", fontStyle:"italic",
      }}>
        {inline(line.slice(2))}
      </div>
    )
  }
  // Empty line
  if (!line.trim()) return <div key={idx} style={{ height:10 }} />
  // Normal paragraph
  return <p key={idx} style={{ margin:"4px 0", color:"var(--c-text)", fontSize:"0.9rem", lineHeight:1.75 }}>{inline(line)}</p>
}

function inline(text: string): React.ReactNode {
  // Parse **bold**, *italic*, `code`
  const parts: React.ReactNode[] = []
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0, m: RegExpExecArray | null
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[2] != null) parts.push(<strong key={m.index} style={{ fontWeight:800, color:"var(--c-text)" }}>{m[2]}</strong>)
    else if (m[3] != null) parts.push(<em key={m.index} style={{ color:"var(--c-text-muted)" }}>{m[3]}</em>)
    else if (m[4] != null) parts.push(<code key={m.index} style={{ backgroundColor:"var(--c-bg-section)", padding:"1px 5px", borderRadius:4, fontSize:"0.85em", fontFamily:"monospace" }}>{m[4]}</code>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>
}

function MdBlock({ lines, struck }: { lines: string[]; struck?: boolean }) {
  const body = <>{lines.map((l, i) => renderMdLine(l, i))}</>
  if (!struck) return body
  return (
    <div style={{ textDecoration:"line-through", opacity:0.45 }}>
      {body}
    </div>
  )
}

function RevisionBlock({ lines, requiredLevel }: { lines: string[]; requiredLevel: number }) {
  return (
    <div style={{
      borderLeft:"2px solid #c0392b", paddingLeft:14,
      backgroundColor:"rgba(192,57,43,0.06)", borderRadius:"0 6px 6px 0",
      padding:"10px 14px", margin:"10px 0",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
        <span style={{
          width:18, height:18, borderRadius:"50%",
          border:"1px solid #c0392b", backgroundColor:"#1a0000",
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          fontSize:"0.5rem", color:"#c0392b", fontFamily:"monospace", fontWeight:700, flexShrink:0,
        }}>
          {romanNumeral(requiredLevel)}
        </span>
        <span style={{ fontSize:"0.65rem", color:"#c0392b", letterSpacing:"0.1em" }}>
          REVIZE · KAICHI {romanNumeral(requiredLevel)}
        </span>
      </div>
      <MdBlock lines={lines} />
    </div>
  )
}

function RedactedBlock({ lines, requiredLevel, unlocked, struck }: {
  lines: string[]; requiredLevel: number; unlocked: boolean; struck?: boolean
}) {
  if (unlocked) {
    return (
      <div style={{
        borderLeft:"2px solid rgba(212,160,23,0.5)", paddingLeft:14,
        backgroundColor:"rgba(212,160,23,0.04)", borderRadius:"0 6px 6px 0",
        padding:"10px 14px", margin:"10px 0",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
          <span style={{
            width:18, height:18, borderRadius:"50%",
            border:"1px solid #d4a017", backgroundColor:"#1a0a00",
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            fontSize:"0.5rem", color:"#d4a017", fontFamily:"monospace", fontWeight:700, flexShrink:0,
          }}>
            {romanNumeral(requiredLevel)}
          </span>
          <span style={{ fontSize:"0.65rem", color:"#d4a017", letterSpacing:"0.1em" }}>UTAJENO · KAICHI {romanNumeral(requiredLevel)}</span>
        </div>
        <MdBlock lines={lines} struck={struck} />
      </div>
    )
  }

  // Calculate approximate height for black bars
  const charCount = lines.join(" ").length
  const barCount = Math.max(1, Math.min(6, Math.ceil(charCount / 80)))

  return (
    <div style={{
      margin:"10px 0",
      backgroundColor:"var(--c-bg-section)",
      border:"1px solid var(--c-border)",
      borderRadius:8, padding:"14px 16px",
      userSelect:"none",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:"0.65rem", color:"var(--c-text-muted)", letterSpacing:"0.1em" }}>
          ███ VYŽADUJE KAICHI {romanNumeral(requiredLevel)} ███
        </span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div key={i} style={{
            height:14, borderRadius:3,
            backgroundColor:"var(--c-text)",
            width: i === barCount - 1 ? `${40 + Math.random() * 45}%` : `${75 + Math.random() * 25}%`,
            opacity:0.85,
          }} />
        ))}
      </div>
    </div>
  )
}

export function WikiRenderer({ content, kaichiLevel }: Props) {
  const blocks = parseBlocks(content)
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "md": {
            const struck = block.revisedAtLevel != null && kaichiLevel >= block.revisedAtLevel
            return <MdBlock key={i} lines={block.lines} struck={struck} />
          }
          case "secret": {
            const struck = block.revisedAtLevel != null && kaichiLevel >= block.revisedAtLevel
            return (
              <RedactedBlock
                key={i}
                lines={block.lines}
                requiredLevel={block.requiredLevel}
                unlocked={kaichiLevel >= block.requiredLevel}
                struck={struck}
              />
            )
          }
          case "revision":
            // Pod úrovní se revize nesmí projevit vůbec — ani jako černé pruhy.
            if (kaichiLevel < block.requiredLevel) return null
            return <RevisionBlock key={i} lines={block.lines} requiredLevel={block.requiredLevel} />
          default: {
            const exhaustive: never = block
            return exhaustive
          }
        }
      })}
    </div>
  )
}
