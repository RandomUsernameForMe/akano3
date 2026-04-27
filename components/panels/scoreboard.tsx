"use client"

import React, { useMemo } from "react"
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react"
import { useGame } from "@/lib/game-context"
import { UNITS, CIRCLES, CHARACTERS } from "@/lib/data"
import { TeamDot } from "@/components/shared/team-icon"

export function ScoreboardComponent({
  mode = "teams",
  compact = false,
  highlightId,
  onModeChange,
  showModeToggle = false,
}: {
  mode?: "teams" | "units" | "circles"
  compact?: boolean
  highlightId?: string
  onModeChange?: (m: "teams" | "units" | "circles") => void
  showModeToggle?: boolean
}) {
  const { teams, pointLog } = useGame()

  const rows = useMemo(() => {
    if (mode === "teams") {
      return [...teams].sort((a,b) => b.points - a.points).map((t,i) => ({
        id: t.id, name: t.name, points: t.points, color: t.color, rank: i+1,
      }))
    }
    if (mode === "units") {
      return UNITS.map(u => {
        const pts = u.teamIds.reduce((s,tid) => s + (teams.find(t=>t.id===tid)?.points??0), 0)
        return { id:u.id, name:u.name, points:pts, color:"#2a8a8a", rank:0 }
      }).sort((a,b)=>b.points-a.points).map((r,i)=>({...r, rank:i+1}))
    }
    return CIRCLES.map(c => {
      const memberTeams = [...new Set(c.memberIds.map(mid => CHARACTERS.find(ch=>ch.id===mid)?.teamId).filter(Boolean) as string[])]
      const pts = memberTeams.reduce((s,tid) => s + (teams.find(t=>t.id===tid)?.points??0), 0)
      return { id:c.id, name:c.name, points:pts, color:"#a052e0", rank:0 }
    }).sort((a,b)=>b.points-a.points).map((r,i)=>({...r, rank:i+1}))
  }, [mode, teams])

  const recentChanges = useMemo(() => {
    const cutoff = new Date(Date.now() - 120000)
    const changes: Record<string, number> = {}
    pointLog.filter(e => e.timestamp > cutoff).forEach(e => {
      e.resolvedTeamIds.forEach(tid => { changes[tid] = (changes[tid]??0) + e.amount })
    })
    return changes
  }, [pointLog])

  const fontSize = compact ? "0.9rem" : "1.1rem"
  const ptSize   = compact ? "1.1rem" : "1.7rem"

  return (
    <div>
      {showModeToggle && (
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {(["teams","units","circles"] as const).map(m => (
            <button key={m} onClick={() => onModeChange?.(m)} style={{
              padding:"4px 12px", borderRadius:6, fontSize:"0.8rem", cursor:"pointer",
              backgroundColor: mode===m ? "#2a8a8a" : "var(--c-bg-section)",
              color: mode===m ? "#fff" : "var(--c-accent)",
              border: `1px solid ${mode===m ? "#2a8a8a" : "var(--c-border-str)"}`,
              fontWeight: mode===m ? 700 : 400,
            }}>
              {m==="teams" ? "Týmy" : m==="units" ? "Jednotky" : "Kruhy"}
            </button>
          ))}
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:compact ? 4 : 6 }}>
        {rows.map(row => {
          const change = recentChanges[row.id] ?? 0
          const isHL   = row.id === highlightId
          return (
            <div key={row.id} style={{
              display:"flex", alignItems:"center", gap:12,
              padding: compact ? "8px 12px" : "16px 20px",
              borderRadius:8,
              backgroundColor: isHL ? "rgba(42,138,138,0.1)" : "var(--c-bg-section)",
              border: `1px solid ${isHL ? "rgba(42,138,138,0.4)" : "var(--c-border)"}`,
              transition:"all 0.3s",
            }}>
              <span style={{
                minWidth: compact ? 24 : 32, fontWeight:900,
                color: row.rank <= 3 ? "#b8860b" : "var(--c-text-faint)",
                fontSize: compact ? "0.85rem" : "1.1rem",
                fontFamily:"monospace",
              }}>
                {row.rank}
              </span>
              <TeamDot color={row.color} teamId={row.id} />
              <span style={{ flex:1, fontWeight:600, color:"var(--c-text)", fontSize }}>
                {row.name}
              </span>
              {change !== 0 && (
                <span style={{
                  fontSize:"0.75rem", fontWeight:700,
                  color: change > 0 ? "#2a8a5a" : "#e05252",
                  minWidth:50, textAlign:"right",
                }}>
                  {change > 0
                    ? <IconChevronUp size={12} style={{display:"inline"}} />
                    : <IconChevronDown size={12} style={{display:"inline"}} />}
                  {change > 0 ? "+" : ""}{change}
                </span>
              )}
              <span style={{
                fontFamily:"monospace", fontWeight:900,
                color:"var(--c-accent)", fontSize: ptSize,
                minWidth:60, textAlign:"right",
              }}>
                {row.points}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
