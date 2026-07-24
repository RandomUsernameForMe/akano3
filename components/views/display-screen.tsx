"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { IconBellRinging, IconVolume, IconShield } from "@tabler/icons-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts"
import { useGame } from "@/lib/game-context"
import { formatDateTime, teamDeltaOf } from "@/lib/utils"
import { TEAM_ICONS } from "@/lib/data"
import { TeamIcon } from "@/components/shared/team-icon"
import type { Team } from "@/lib/types"

function EndLabel({ cx, cy, index, lastIndex, color, name, iconTeamId }: {
  cx?: number; cy?: number; index?: number; lastIndex: number; color: string; name: string; iconTeamId?: string
}) {
  if (index !== lastIndex || cx == null || cy == null) return null
  const Icon = (iconTeamId ? TEAM_ICONS[iconTeamId] : undefined) ?? IconShield
  return (
    <g transform={`translate(${cx + 10}, ${cy - 12})`}>
      <Icon size={24} color={color} strokeWidth={2} />
      <text x={30} y={12} fill={color} fontSize={20} fontWeight={700} fontFamily="Space Mono, monospace" dominantBaseline="middle">
        {name}
      </text>
    </g>
  )
}

function ClockDisplay() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("cs-CZ"))
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString("cs-CZ")), 1000)
    return () => clearInterval(iv)
  }, [])
  return <span style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.8rem", fontFamily:"var(--font-mono)" }}>{time}</span>
}

const VIEWS = ["teamScores", "studentScores", "teamChart", "studentChart"] as const
type View = typeof VIEWS[number]
const VIEW_TITLE: Record<View, string> = {
  teamScores: "Žebříček týmů", studentScores: "Žebříček studentů",
  teamChart: "Vývoj týmů v čase", studentChart: "Vývoj studentů v čase",
}

export function DisplayScreen() {
  const { teams, characters, pointLog, alarmState, broadcastActive } = useGame()
  const [view, setView] = useState<View>("teamScores")
  const [progress, setProgress] = useState(0)   // 0..1 until next auto-rotate
  const ROTATE_MS = 18000
  const cycleStart = useRef(Date.now())

  const goToView = (v: View) => { setView(v); cycleStart.current = Date.now(); setProgress(0) }

  useEffect(() => {
    const iv = setInterval(() => {
      const elapsed = Date.now() - cycleStart.current
      if (elapsed >= ROTATE_MS) {
        cycleStart.current = Date.now()
        setProgress(0)
        setView(v => VIEWS[(VIEWS.indexOf(v) + 1) % VIEWS.length])
      } else {
        setProgress(elapsed / ROTATE_MS)
      }
    }, 100)
    return () => clearInterval(iv)
  }, [])

  const sorted = useMemo(() => [...teams].sort((a,b) => b.points - a.points), [teams])
  const teamColor = (tid?: string) => teams.find(t => t.id === tid)?.color ?? "#c8a96e"
  const students = useMemo(() =>
    characters.filter(c => c.role === "student" || c.role === "ruze").sort((a,b) => b.points - a.points)
  , [characters])
  const topStudents = useMemo(() => students.slice(0, 10), [students])

  const timeData = useMemo(() => {
    const sortedLog = [...pointLog].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    const runningTotals: Record<string, number> = {}
    const deltas = sortedLog.map(teamDeltaOf)
    teams.forEach(t => {
      const loggedSum = deltas.reduce((s,d) => s + (d[t.id] ?? 0), 0)
      runningTotals[t.id] = t.points - loggedSum
    })
    const buckets: Record<string, Record<string, number>> = {}
    sortedLog.forEach((e, i) => {
      const d = deltas[i]
      for (const tid in d) runningTotals[tid] = (runningTotals[tid] ?? 0) + d[tid]
      const key = formatDateTime(e.timestamp)
      if (!buckets[key]) buckets[key] = { time: key as any }
      teams.forEach(t => { buckets[key][t.id] = runningTotals[t.id] ?? 0 })
    })
    return Object.values(buckets)
  }, [teams, pointLog])

  // Per-student running totals. Legacy entries have no per-student attribution,
  // so lines stay flat at the baseline until individual awards move them.
  const studentTimeData = useMemo(() => {
    const sortedLog = [...pointLog].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    const charDelta = (e: typeof sortedLog[number]) => {
      const d: Record<string, number> = {}
      if (e.resolvedCharacterIds?.length) for (const c of e.resolvedCharacterIds) d[c] = (d[c] ?? 0) + e.amount
      return d
    }
    const deltas = sortedLog.map(charDelta)
    const running: Record<string, number> = {}
    topStudents.forEach(s => {
      running[s.id] = s.points - deltas.reduce((acc,d) => acc + (d[s.id] ?? 0), 0)
    })
    const buckets: Record<string, Record<string, number>> = {}
    sortedLog.forEach((e, i) => {
      const d = deltas[i]
      for (const cid in d) if (cid in running) running[cid] = (running[cid] ?? 0) + d[cid]
      const key = formatDateTime(e.timestamp)
      if (!buckets[key]) buckets[key] = { time: key as any }
      topStudents.forEach(s => { buckets[key][s.id] = running[s.id] ?? 0 })
    })
    return Object.values(buckets)
  }, [topStudents, pointLog])

  const formatTimeOnly = (val: string) => val?.slice(-5) ?? val

  if (alarmState.active) {
    return (
      <div className="alarm-overlay" style={{
        position:"fixed", inset:0, zIndex:9999,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        backgroundColor: alarmState.color,
      }}>
        <IconBellRinging size={80} color="white" style={{ marginBottom:32 }} className="alarm-pulse" />
        <h1 className="alarm-flash-text" style={{
          fontFamily:"var(--font-display)", textTransform:"uppercase",
          color:"#fff", fontSize:"clamp(2rem,8vw,6rem)", fontWeight:700,
          textAlign:"center", padding:"0 40px", letterSpacing:"0.03em",
          textShadow:"0 0 40px rgba(0,0,0,0.5)",
        }}>
          {alarmState.message || alarmState.type.toUpperCase()}
        </h1>
        <p className="ds-overline" style={{ color:"rgba(255,255,255,0.6)", fontSize:"1.1rem", marginTop:24 }}>
          AKANO · ALARM SYSTÉM
        </p>
      </div>
    )
  }

  return (
    <div style={{
      position:"fixed", inset:0,
      backgroundColor:"#3A0808",   // DS flat oxblood ground — no gradient mush
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
      {/* Loading bar — time until next screen */}
      <div style={{ height:8, backgroundColor:"rgba(255,255,255,0.14)", flexShrink:0 }}>
        <div style={{
          height:"100%", width:`${progress * 100}%`,
          background:"linear-gradient(90deg, #d4a017, #e8c65a)",
          boxShadow:"0 0 12px rgba(212,160,23,0.8)",
          transition:"width 0.1s linear",
        }} />
      </div>

      {broadcastActive && (
        <div style={{
          backgroundColor:"#2a8a8a33", borderBottom:"1px solid #2a8a8a60",
          padding:"6px 24px", textAlign:"right",
          color:"#2a8a8a", fontSize:"0.8rem", fontWeight:600,
        }}>
          <IconVolume size={13} style={{display:"inline",marginRight:6}} />
          ŽIVÉ VYSÍLÁNÍ
        </div>
      )}

      <div style={{ textAlign:"center", padding:"20px 0 10px", flexShrink:0 }}>
        <h1 className="ds-label" style={{
          color:"var(--sand-400)", fontSize:"clamp(1.2rem,3.4vw,2.4rem)", fontWeight:700,
          letterSpacing:"0.15em", margin:0,
        }}>
          AKANO
        </h1>
        <p className="ds-overline" style={{
          color:"rgba(255,255,255,0.4)", fontSize:"clamp(0.6rem,1.2vw,0.8rem)", marginTop:6,
        }}>
          {VIEW_TITLE[view]}
        </p>
      </div>

      <div style={{ flex:1, overflow:"hidden", padding:"0 32px 8px", display:"flex", flexDirection:"column" }}>

        {(view === "teamScores" || view === "studentScores") && (
          <div style={{ flex:1, overflowY:"auto" }}>
            <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexDirection:"column", gap: view === "studentScores" ? 5 : 8 }}>
              {(view === "teamScores"
                ? sorted.map(t => ({ id:t.id, name:t.name, points:t.points, teamId:t.id }))
                : students.map(s => ({ id:s.id, name:s.name, points:s.points, teamId:s.teamId }))
              ).map((row, i) => (
                <div key={row.id} style={{
                  display:"flex", alignItems:"center", gap:20,
                  padding: view === "studentScores" ? "clamp(4px,1vh,10px) 28px" : "clamp(8px,1.5vh,18px) 28px",
                  backgroundColor: i === 0 ? "rgba(200,160,60,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === 0 ? "rgba(200,160,60,0.35)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius:10, transition:"all 0.5s ease",
                }}>
                  <span style={{
                    minWidth:"3ch", fontFamily:"var(--font-mono)", fontWeight:900,
                    fontSize:"clamp(1rem,2.2vw,2rem)",
                    color: i === 0 ? "#d4a017" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "rgba(200,169,110,0.35)",
                  }}>{i + 1}</span>
                  {row.teamId && <TeamIcon teamId={row.teamId} size={26} strokeWidth={1.5} />}
                  <span style={{
                    flex:1,
                    fontSize:"clamp(0.9rem,2vw,1.8rem)",
                    fontWeight:700, color:"rgba(255,255,255,0.92)", letterSpacing:"0.04em",
                  }}>{row.name}</span>
                  <span style={{
                    fontFamily:"var(--font-mono)", fontWeight:900,
                    fontSize:"clamp(1.1rem,2.6vw,2.3rem)",
                    color: i === 0 ? "#c8a96e" : "rgba(255,255,255,0.88)", letterSpacing:"0.05em",
                  }}>{row.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(view === "teamChart" || view === "studentChart") && (() => {
          const isTeam = view === "teamChart"
          const data = isTeam ? timeData : studentTimeData
          const lines = isTeam
            ? sorted.map(t => ({ id:t.id, name:t.name, color:t.color, iconTeamId:t.id }))
            : topStudents.map(s => ({ id:s.id, name:s.name, color:teamColor(s.teamId), iconTeamId:s.teamId }))
          return (
            <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:1100, margin:"0 auto", width:"100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top:10, right:230, bottom:50, left:10 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill:"rgba(255,255,255,0.75)", fontSize:18, fontFamily:"var(--font-mono)" }}
                    tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.12)" }}
                    angle={-35} textAnchor="end" height={70}
                    interval={Math.max(0, Math.floor(data.length / 6))}
                    tickFormatter={formatTimeOnly}
                  />
                  <YAxis
                    tick={{ fill:"rgba(255,255,255,0.75)", fontSize:18, fontFamily:"var(--font-mono)" }}
                    tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.12)" }}
                    width={60} domain={["auto", "auto"]}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor:"rgba(30,5,10,0.95)", border:"1px solid rgba(200,169,110,0.3)", color:"#e8d5b0", borderRadius:6, fontSize:16 }}
                    labelStyle={{ color:"rgba(200,169,110,0.7)", fontSize:"0.9rem" }}
                  />
                  {lines.map(ln => (
                    <Line
                      key={ln.id} type="monotone" dataKey={ln.id} name={ln.name}
                      stroke={ln.color} strokeWidth={isTeam ? 4 : 3}
                      dot={(props: any) => <EndLabel {...props} lastIndex={data.length - 1} color={ln.color} name={ln.name} iconTeamId={ln.iconTeamId} />}
                      activeDot={{ r:7, fill:ln.color }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        })()}
      </div>

      <div style={{
        borderTop:"1px solid rgba(255,255,255,0.08)",
        padding:"8px 24px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexShrink:0,
      }}>
        <span className="ds-overline" style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.72rem" }}>
          AKANO · SCOREBOARD
        </span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => goToView(v)} style={{
              width:8, height:8, borderRadius:"50%", border:"none", cursor:"pointer", padding:0,
              backgroundColor: view === v ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
              transition:"background 0.3s",
            }} />
          ))}
        </div>
        <ClockDisplay />
      </div>
    </div>
  )
}
