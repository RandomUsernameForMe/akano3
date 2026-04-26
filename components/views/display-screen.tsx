"use client"

import React, { useState, useEffect, useMemo } from "react"
import { IconBellRinging, IconVolume } from "@tabler/icons-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from "recharts"
import { useGame } from "@/lib/game-context"
import { formatDateTime } from "@/lib/utils"
import { TeamIcon } from "@/components/shared/team-icon"

function ClockDisplay() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("cs-CZ"))
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString("cs-CZ")), 1000)
    return () => clearInterval(iv)
  }, [])
  return <span style={{ color:"rgba(200,169,110,0.5)", fontSize:"0.8rem", fontFamily:"monospace" }}>{time}</span>
}

export function DisplayScreen() {
  const { teams, pointLog, alarmState, broadcastActive } = useGame()
  const [view, setView] = useState<"scores" | "chart">("scores")
  const ROTATE_MS = 18000

  useEffect(() => {
    const iv = setInterval(() => setView(v => v === "scores" ? "chart" : "scores"), ROTATE_MS)
    return () => clearInterval(iv)
  }, [])

  const sorted = useMemo(() => [...teams].sort((a,b) => b.points - a.points), [teams])

  const timeData = useMemo(() => {
    const sortedLog = [...pointLog].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    const runningTotals: Record<string, number> = {}
    teams.forEach(t => {
      const loggedSum = sortedLog.reduce((s,e) => e.resolvedTeamIds.includes(t.id) ? s + e.amount : s, 0)
      runningTotals[t.id] = t.points - loggedSum
    })
    const buckets: Record<string, Record<string, number>> = {}
    sortedLog.forEach(e => {
      e.resolvedTeamIds.forEach(tid => { runningTotals[tid] = (runningTotals[tid]??0) + e.amount })
      const key = formatDateTime(e.timestamp)
      if (!buckets[key]) buckets[key] = { time: key as any }
      teams.forEach(t => { buckets[key][t.id] = runningTotals[t.id] ?? 0 })
    })
    return Object.values(buckets)
  }, [teams, pointLog])

  if (alarmState.active) {
    return (
      <div className="alarm-overlay" style={{
        position:"fixed", inset:0, zIndex:9999,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        backgroundColor: alarmState.color,
      }}>
        <IconBellRinging size={80} color="white" style={{ marginBottom:32 }} className="alarm-pulse" />
        <h1 className="alarm-flash-text" style={{
          color:"#fff", fontSize:"clamp(2rem,8vw,6rem)", fontWeight:900,
          textAlign:"center", padding:"0 40px", letterSpacing:"0.02em",
          textShadow:"0 0 40px rgba(0,0,0,0.5)",
        }}>
          {alarmState.message || alarmState.type.toUpperCase()}
        </h1>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"1.2rem", marginTop:24, letterSpacing:"0.2em" }}>
          AKANO · ALARM SYSTÉM
        </p>
      </div>
    )
  }

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"radial-gradient(ellipse at 50% 0%, #8c1f2a 0%, #6b0f1a 50%, #3a0810 100%)",
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
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
        <h1 style={{
          color:"#c8a96e", fontSize:"clamp(1rem,3vw,2rem)", fontWeight:900,
          letterSpacing:"0.1em", opacity:0.45, margin:0,
        }}>
          AKANO
        </h1>
        <p style={{
          color:"rgba(200,169,110,0.35)", fontSize:"clamp(0.6rem,1.2vw,0.8rem)",
          letterSpacing:"0.25em", marginTop:4,
        }}>
          {view === "scores" ? "ŽEBŘÍČEK" : "VÝVOJ V ČASE"}
        </p>
      </div>

      <div style={{ flex:1, overflow:"hidden", padding:"0 32px 8px", display:"flex", flexDirection:"column" }}>

        {view === "scores" && (
          <div style={{ flex:1, overflowY:"auto" }}>
            <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexDirection:"column", gap:8 }}>
              {sorted.map((team, i) => (
                <div key={team.id} style={{
                  display:"flex", alignItems:"center", gap:20,
                  padding:"clamp(8px,1.5vh,18px) 28px",
                  backgroundColor: i === 0 ? "rgba(212,160,23,0.1)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${i === 0 ? "rgba(212,160,23,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius:10, transition:"all 0.5s ease",
                }}>
                  <span style={{
                    minWidth:"3ch", fontFamily:"monospace", fontWeight:900,
                    fontSize:"clamp(1.2rem,2.5vw,2.2rem)",
                    color: i === 0 ? "#d4a017" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "rgba(200,169,110,0.35)",
                  }}>{i + 1}</span>
                  <TeamIcon teamId={team.id} size={28} strokeWidth={1.5} />
                  <span style={{
                    flex:1,
                    fontSize:"clamp(1rem,2.2vw,2rem)",
                    fontWeight:700, color:"#e8d5b0", letterSpacing:"0.05em",
                  }}>{team.name}</span>
                  <span style={{
                    fontFamily:"monospace", fontWeight:900,
                    fontSize:"clamp(1.2rem,3vw,2.5rem)",
                    color:"#c8a96e", letterSpacing:"0.05em",
                  }}>{team.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "chart" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:1100, margin:"0 auto", width:"100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top:10, right:30, bottom:10, left:10 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.07)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill:"rgba(200,169,110,0.5)", fontSize:"clamp(8px,1vw,12px)" }}
                  tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.1)" }}
                />
                <YAxis
                  tick={{ fill:"rgba(200,169,110,0.5)", fontSize:"clamp(8px,1vw,12px)" }}
                  tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.1)" }}
                  width={45}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor:"rgba(30,5,10,0.95)", border:"1px solid rgba(200,169,110,0.3)", color:"#e8d5b0", borderRadius:6 }}
                  labelStyle={{ color:"rgba(200,169,110,0.7)", fontSize:"0.75rem" }}
                />
                <Legend
                  wrapperStyle={{ color:"rgba(200,169,110,0.7)", fontSize:"clamp(9px,1vw,13px)", paddingTop:8 }}
                />
                {sorted.map(t => (
                  <Line
                    key={t.id} type="monotone" dataKey={t.id} name={t.name}
                    stroke={t.color} strokeWidth={3} dot={false}
                    activeDot={{ r:5, fill:t.color }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div style={{
        borderTop:"1px solid rgba(255,255,255,0.08)",
        padding:"8px 24px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexShrink:0,
      }}>
        <span style={{ color:"rgba(200,169,110,0.4)", fontSize:"0.75rem", letterSpacing:"0.15em" }}>
          AKANO · SCOREBOARD
        </span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {(["scores","chart"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              width:8, height:8, borderRadius:"50%", border:"none", cursor:"pointer", padding:0,
              backgroundColor: view === v ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.2)",
              transition:"background 0.3s",
            }} />
          ))}
        </div>
        <ClockDisplay />
      </div>
    </div>
  )
}
