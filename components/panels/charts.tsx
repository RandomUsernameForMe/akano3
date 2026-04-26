"use client"

import React, { useState, useMemo } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from "recharts"
import { useGame } from "@/lib/game-context"
import { formatDateTime } from "@/lib/utils"

export function ChartsPanel({ singleTeamId }: { singleTeamId?: string }) {
  const { teams, pointLog } = useGame()
  const [hiddenTeams, setHiddenTeams] = useState<Set<string>>(new Set())

  const timeData = useMemo(() => {
    const buckets: Record<string, Record<string, number>> = {}
    const sortedLog = [...pointLog].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    const runningTotals: Record<string, number> = {}
    teams.forEach(t => {
      const loggedSum = sortedLog.reduce((s,e) => e.resolvedTeamIds.includes(t.id) ? s + e.amount : s, 0)
      runningTotals[t.id] = t.points - loggedSum
    })
    sortedLog.forEach(e => {
      const key = formatDateTime(e.timestamp)
      e.resolvedTeamIds.forEach(tid => { runningTotals[tid] = (runningTotals[tid]??0) + e.amount })
      if (!buckets[key]) buckets[key] = { time: key as any }
      teams.forEach(t => { buckets[key][t.id] = runningTotals[t.id] ?? 0 })
    })
    return Object.values(buckets)
  }, [teams, pointLog])

  const displayTeams = singleTeamId ? teams.filter(t => t.id === singleTeamId) : teams

  return (
    <div>
      <div style={{
        backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
        borderRadius:10, padding:20, marginBottom:20,
      }}>
        <p style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:16 }}>VÝVOJ BODŮ V ČASE</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#a0263318" />
            <XAxis dataKey="time" tick={{ fill:"rgba(107,15,26,0.45)", fontSize:10 }} />
            <YAxis tick={{ fill:"rgba(107,15,26,0.45)", fontSize:10 }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a" }}
            />
            <Legend
              wrapperStyle={{ fontSize:"0.75rem", color:"#6b0f1a" }}
              onClick={e => {
                const id = displayTeams.find(t => t.name === e.dataKey)?.id
                if (!id) return
                setHiddenTeams(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
              }}
            />
            {displayTeams.map(t => (
              <Line key={t.id} type="monotone" dataKey={t.id} name={t.name}
                stroke={t.color} strokeWidth={2} dot={false}
                hide={hiddenTeams.has(t.id)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
