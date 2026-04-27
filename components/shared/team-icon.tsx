"use client"

import React from "react"
import { IconShield } from "@tabler/icons-react"
import { TEAM_ICONS } from "@/lib/data"

export function TeamIcon({
  teamId, size = 16, strokeWidth = 1.8,
}: {
  teamId?: string; size?: number; strokeWidth?: number
}) {
  const Icon = teamId ? (TEAM_ICONS[teamId] ?? IconShield) : IconShield
  return <Icon size={size} color="#888" strokeWidth={strokeWidth} style={{ flexShrink:0 }} />
}

// Legacy alias — keep so existing call-sites that pass only color still compile
export function TeamDot({ color: _color, teamId }: { color: string; teamId?: string }) {
  return <TeamIcon teamId={teamId} size={15} />
}
