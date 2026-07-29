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
            backgroundColor: broadcastActive ? "var(--destructive)" : "transparent",
            border: `1px solid ${broadcastActive ? "var(--destructive)" : "rgba(224,176,128,0.45)"}`,
            color: broadcastActive ? "#F4ECDF" : "var(--sand-400)",
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
  const hacked = currentUser?.role === "ruze"   // Růže vandalized the brand band
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"10px 24px",
      backgroundColor:"var(--c-brandband)",    // brand band — oxblood night (hacked over for Růže)
      borderBottom: hacked ? "2px solid var(--pink-hot)" : "2px solid var(--ink-900)", // DS ink keyline
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={logout} style={{
          display:"flex", alignItems:"center", gap:10,
          background:"transparent", border:"none", padding:0, cursor:"pointer",
          position:"relative",
        }}>
          <img src="/akano-logo.png" alt="" height={24} style={{ height:24, width:"auto", display:"block", opacity: hacked ? 0.45 : 1 }} />
          <span style={{
            fontFamily:"var(--font-display)", textTransform:"uppercase",
            color:"var(--bone-100)", fontWeight:700, fontSize:"1.25rem", letterSpacing:"0.06em",
            opacity: hacked ? 0.45 : 1,
          }}>
            AKANO
          </span>
          {hacked && (
            /* rose sprayed across the logo — vandal sticker */
            <img src="/ruze-rose.png" alt="" style={{
              position:"absolute", left:-14, top:-16, height:56, width:"auto",
              transform:"rotate(-14deg)", pointerEvents:"none",
              filter:"drop-shadow(0 0 6px rgba(255,46,136,0.6))",
            }} />
          )}
        </button>
        {alarmState.active && (
          <span style={{ backgroundColor:"#A32B2233", color:"#e05252", border:"1px solid #A32B2255",
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
            <span style={{ color:"var(--bone-100)", fontSize:"0.85rem" }}>{currentUser.name}</span>
            <RoleBadge role={currentUser.role} />
          </div>
        )}
        <button onClick={toggle} title={theme === "dark" ? "Světlý mód" : "Tmavý mód"} style={{
          background:"transparent", border:"1px solid rgba(244,236,223,0.28)",
          color:"var(--sand-400)", padding:"5px 8px", borderRadius:6,
          cursor:"pointer", display:"flex", alignItems:"center",
        }}>
          {theme === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
        </button>
        <button onClick={logout} style={{
          background:"transparent", border:"1px solid rgba(244,236,223,0.28)",
          color:"var(--sand-400)", padding:"5px 10px", borderRadius:6,
          cursor:"pointer", display:"flex", alignItems:"center", gap:4,
          fontSize:"0.8rem",
        }}>
          <IconLogout size={14} /> Odejít
        </button>
      </div>
    </div>
  )
}
