"use client"

import React from "react"
import { IconMicrophone, IconMicrophoneOff, IconLogout, IconBellRinging } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGame } from "@/lib/game-context"
import { RoleBadge } from "./badges"

function BroadcastButton() {
  const { broadcastActive, setBroadcast } = useGame()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={() => setBroadcast(!broadcastActive)}
          render={<button />}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"6px 12px", borderRadius:6,
            backgroundColor: broadcastActive ? "#c0392b" : "transparent",
            border: `1px solid ${broadcastActive ? "#c0392b" : "#a0263380"}`,
            color: broadcastActive ? "#fff" : "#c8a96e",
            cursor:"pointer", fontSize:"0.8rem", fontWeight:600,
            transition:"all 0.2s",
          }}
        >
          {broadcastActive
            ? <><IconMicrophone size={14} className="alarm-pulse" /> Vysíláte ŽIVĚ</>
            : <><IconMicrophoneOff size={14} /> Rozhlas</>}
        </TooltipTrigger>
        <TooltipContent>
          {broadcastActive ? "Zastavit vysílání" : "Spustit rozhlas"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function TopBar({ showBroadcast = true }: { showBroadcast?: boolean }) {
  const { currentUser, logout, alarmState } = useGame()
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"10px 24px",
      backgroundColor:"#fff",
      borderBottom:"1px solid rgba(107,15,26,0.12)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ color:"#6b0f1a", fontWeight:700, fontSize:"1.1rem", letterSpacing:"0.02em" }}>
          AKANO
        </span>
        {alarmState.active && (
          <span style={{ backgroundColor:"#c0392b33", color:"#e05252", border:"1px solid #c0392b55",
            padding:"2px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.04em" }}>
            <IconBellRinging size={11} style={{ display:"inline", marginRight:4 }} />
            ALARM
          </span>
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {showBroadcast && <BroadcastButton />}
        {currentUser && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#1a0a0a", fontSize:"0.85rem" }}>{currentUser.name}</span>
            <RoleBadge role={currentUser.role} />
          </div>
        )}
        <button onClick={logout} style={{
          background:"transparent", border:"1px solid rgba(107,15,26,0.2)",
          color:"rgba(107,15,26,0.5)", padding:"5px 10px", borderRadius:6,
          cursor:"pointer", display:"flex", alignItems:"center", gap:4,
          fontSize:"0.8rem",
        }}>
          <IconLogout size={14} /> Odejít
        </button>
      </div>
    </div>
  )
}
