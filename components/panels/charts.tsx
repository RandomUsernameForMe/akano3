"use client"

import React, { useMemo } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts"
import { IconShield } from "@tabler/icons-react"
import { useGame } from "@/lib/game-context"
import { formatDateTime } from "@/lib/utils"
import { TEAM_ICONS } from "@/lib/data"
import type { Team } from "@/lib/types"

function EndLabel({ cx, cy, index, lastIndex, team }: {
  cx?: number; cy?: number; index?: number; lastIndex: number; team: Team
}) {
  if (index !== lastIndex || cx == null || cy == null) return null
  const Icon = TEAM_ICONS[team.id] ?? IconShield
  return (
    <g transform={`translate(${cx + 6}, ${cy - 7})`}>
      <Icon size={14} color={team.color} strokeWidth={1.8} />
      <text x={18} y={7} fill={team.color} fontSize={10} fontFamily="monospace" dominantBaseline="middle">
        {team.name}
      </text>
    </g>
  )
}

export function ChartsPanel({ singleTeamId }: { singleTeamId?: string }) {
  const { teams, pointLog } = useGame()

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
  const lastIndex = timeData.length - 1

  return (
    <div>
      <div style={{
        backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
        borderRadius:10, padding:20, marginBottom:20,
      }}>
        <p style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:16 }}>VÝVOJ BODŮ V ČASE</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeData} margin={{ right: 130 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#a0263318" />
            <XAxis dataKey="time" tick={{ fill:"rgba(107,15,26,0.45)", fontSize:10 }} />
            <YAxis tick={{ fill:"rgba(107,15,26,0.45)", fontSize:10 }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a" }}
            />
            {displayTeams.map(t => (
              <Line key={t.id} type="monotone" dataKey={t.id} name={t.name}
                stroke={t.color} strokeWidth={2}
                dot={(props: any) => <EndLabel {...props} lastIndex={lastIndex} team={t} />}
                activeDot={{ r: 3, stroke: t.color, fill: t.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
