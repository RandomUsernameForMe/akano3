"use client"

import React, { useState } from "react"
import {
  IconBellRinging, IconX, IconCircleCheck,
  IconRun, IconSwords, IconUsers, IconAlarm,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useGame } from "@/lib/game-context"
import type { AlarmState } from "@/lib/types"

export function AlarmPanel() {
  const { alarmState, triggerAlarm, dismissAlarm } = useGame()
  const [confirmType, setConfirmType] = useState<AlarmState["type"] | null>(null)
  const [confirmMsg,  setConfirmMsg]  = useState("")
  const [customMsg,   setCustomMsg]   = useState("")

  const ALARM_TYPES: { type: AlarmState["type"]; label: string; color: string; icon: React.ElementType }[] = [
    { type:"evacuation", label:"Evakuace",  color:"#c0392b", icon:IconRun    },
    { type:"battle",     label:"Do zbraně", color:"#d4813a", icon:IconSwords },
    { type:"assembly",   label:"Nástup",    color:"#d4c017", icon:IconUsers  },
    { type:"custom",     label:"Vlastní",   color:"#7d1520", icon:IconAlarm  },
  ]

  return (
    <div>
      {alarmState.active ? (
        <div style={{
          backgroundColor:"#c0392b22", border:"2px solid #c0392b",
          borderRadius:12, padding:24, textAlign:"center", marginBottom:24,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12 }}>
            <IconBellRinging size={24} color="#e05252" className="alarm-pulse" />
            <span style={{ color:"#e05252", fontWeight:900, fontSize:"1.2rem", letterSpacing:"0.1em" }}>
              ALARM AKTIVNÍ
            </span>
          </div>
          <p style={{ color:"#1a0a0a", fontSize:"1rem", marginBottom:16 }}>{alarmState.message || alarmState.type.toUpperCase()}</p>
          <Button onClick={dismissAlarm} style={{ backgroundColor:"#c0392b", color:"#fff", fontWeight:700, padding:"10px 32px" }}>
            <IconX size={16} style={{marginRight:6}} /> Zrušit alarm
          </Button>
        </div>
      ) : (
        <p style={{ color:"#2a8a5a", fontSize:"0.85rem", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
          <IconCircleCheck size={16} /> Žádný alarm není aktivní
        </p>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
        {ALARM_TYPES.map(({ type, label, color, icon:Icon }) => (
          <button
            key={type}
            disabled={alarmState.active}
            onClick={() => { setConfirmType(type); setConfirmMsg(type === "custom" ? customMsg : label.toUpperCase()) }}
            style={{
              padding:"20px 16px", borderRadius:10,
              backgroundColor: color + "22",
              border: `2px solid ${color}66`,
              color, cursor: alarmState.active ? "not-allowed" : "pointer",
              opacity: alarmState.active ? 0.5 : 1,
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              transition:"all 0.2s", fontWeight:700, fontSize:"0.95rem",
            }}
          >
            <Icon size={28} />
            {label}
          </button>
        ))}
      </div>

      {confirmType === "custom" && !alarmState.active && (
        <div style={{ marginTop:16 }}>
          <Input value={customMsg} onChange={e => { setCustomMsg(e.target.value); setConfirmMsg(e.target.value) }}
            placeholder="Zpráva alarmu…"
            style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }} />
        </div>
      )}

      <AlertDialog open={!!confirmType} onOpenChange={v => !v && setConfirmType(null)}>
        <AlertDialogContent style={{ backgroundColor:"#7d1520", border:"1px solid #c0392b" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Spustit alarm?</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              Alarm <strong style={{ color:"#e05252" }}>{confirmMsg}</strong> se zobrazí na všech obrazovkách.
              <br /><span style={{ fontSize:"0.8rem" }}>Tuto akci uvidí všichni hráči.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (confirmType) { triggerAlarm(confirmType, confirmMsg); setConfirmType(null) } }}
              style={{ backgroundColor:"#c0392b", color:"#fff" }}>
              Spustit alarm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
