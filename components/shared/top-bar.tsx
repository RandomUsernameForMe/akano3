"use client"

import React from "react"
import { IconMicrophone, IconMicrophoneOff, IconLogout, IconBellRinging, IconSun, IconMoon } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGame } from "@/lib/game-context"
import { useTheme } from "@/lib/theme-context"
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
  const { theme, toggle } = useTheme()
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"10px 24px",
      backgroundColor:"var(--c-topbar)",
      borderBottom:"1px solid var(--c-border)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={logout} style={{
          background:"transparent", border:"none", padding:0, cursor:"pointer",
          color:"var(--c-accent)", fontWeight:700, fontSize:"1.1rem", letterSpacing:"0.02em",
        }}>
          AKANO
        </button>
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
            <span style={{ color:"var(--c-text)", fontSize:"0.85rem" }}>{currentUser.name}</span>
            <RoleBadge role={currentUser.role} />
          </div>
        )}
        <button onClick={toggle} title={theme === "dark" ? "Světlý mód" : "Tmavý mód"} style={{
          background:"transparent", border:"1px solid var(--c-border-str)",
          color:"var(--c-text-muted)", padding:"5px 8px", borderRadius:6,
          cursor:"pointer", display:"flex", alignItems:"center",
        }}>
          {theme === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
        </button>
        <button onClick={logout} style={{
          background:"transparent", border:"1px solid var(--c-border-str)",
          color:"var(--c-text-muted)", padding:"5px 10px", borderRadius:6,
          cursor:"pointer", display:"flex", alignItems:"center", gap:4,
          fontSize:"0.8rem",
        }}>
          <IconLogout size={14} /> Odejít
        </button>
      </div>
    </div>
  )
}
