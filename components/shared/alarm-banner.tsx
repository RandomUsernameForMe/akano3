"use client"

import React from "react"
import { IconBellRinging } from "@tabler/icons-react"
import { useGame } from "@/lib/game-context"

export function AlarmBannerStrip() {
  const { alarmState } = useGame()
  if (!alarmState.active) return null
  return (
    <div style={{
      backgroundColor:"#A32B22", color:"#F4ECDF",
      padding:"6px 16px", textAlign:"center",
      fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.05em",
    }}>
      <IconBellRinging size={14} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }} />
      ALARM AKTIVNÍ: {alarmState.message || alarmState.type.toUpperCase()}
    </div>
  )
}
