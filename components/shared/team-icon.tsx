"use client"

import React from "react"
import { IconShield } from "@tabler/icons-react"
import { TEAMS, TEAM_ICONS } from "@/lib/data"

export function TeamIcon({
  teamId, color, size = 16, strokeWidth = 1.8,
}: {
  teamId?: string; color?: string; size?: number; strokeWidth?: number
}) {
  const team = teamId ? TEAMS.find(t => t.id === teamId) : undefined
  const fill = color ?? team?.color ?? "#888"
  const Icon = teamId ? (TEAM_ICONS[teamId] ?? IconShield) : IconShield
  return <Icon size={size} color={fill} strokeWidth={strokeWidth} style={{ flexShrink:0 }} />
}

// Legacy alias — keep so existing call-sites that pass only color still compile
export function TeamDot({ color, teamId }: { color: string; teamId?: string }) {
  return <TeamIcon teamId={teamId} color={color} size={15} />
}
