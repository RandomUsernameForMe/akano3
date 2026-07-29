"use client"

import React from "react"
import type { Role, ActionType, Specialization } from "@/lib/types"
import { ACTION_LABELS } from "@/lib/constants"
import { romanNumeral } from "@/lib/utils"

export function KaichiBadge({ level }: { level: number }) {
  if (!level) return null
  return (
    <span style={{
      display:"inline-block", backgroundColor:"var(--ink-900)", color:"var(--sand-500)",
      fontFamily:"var(--font-mono)", fontWeight:"bold",
      padding:"2px 10px", borderRadius:"4px", fontSize:"0.8rem",
      border:"1px solid rgba(224,176,128,0.45)", letterSpacing:"0.05em",
    }}>
      Kaichi {romanNumeral(level)}
    </span>
  )
}

export function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, [string, string]> = {
    gm:      ["#108080","GM"],
    teacher: ["#5252e0","Učitel"],
    ruze:    ["#e052b4","Růže"],
    student: ["#52b0e0","Student"],
    display: ["#888","Obrazovka"],
  }
  const [color, label] = map[role]
  return (
    <span className="ds-label" style={{
      backgroundColor: color + "33", color, border:`1px solid ${color}66`,
      padding:"2px 8px", borderRadius:"4px", fontSize:"0.72rem",
    }}>
      {label}
    </span>
  )
}

export function ActionBadge({ type }: { type: ActionType }) {
  const colors: Record<ActionType, string> = {
    mission_success:"#2F7D4F", mission_fail:"#A32B22", lesson:"#5252e0",
    shidosei:"#d4a017",        informant:"#e07832",    monster:"#a052e0",
    simulation:"#52b0e0",      qr_quest:"#108080",     peer_gift:"#e052b4",
    correction:"#888",
  }
  const c = colors[type]
  return (
    <span className="ds-label" style={{
      backgroundColor: c + "22", color: c, border:`1px solid ${c}44`,
      padding:"2px 7px", borderRadius:"4px", fontSize:"0.68rem",
      whiteSpace:"nowrap",
    }}>
      {ACTION_LABELS[type]}
    </span>
  )
}

export function SpecBadge({ spec }: { spec?: Specialization }) {
  if (!spec) return null
  const map: Record<Specialization, [string, string]> = {
    combat:   ["#A32B22","Boj"],
    tactical: ["#5268e0","Taktika"],
    support:  ["#52d4b4","Podpora"],
  }
  const [c, label] = map[spec]
  return (
    <span className="ds-label" style={{
      backgroundColor: c + "22", color: c, border:`1px solid ${c}44`,
      padding:"1px 7px", borderRadius:"4px", fontSize:"0.68rem",
    }}>
      {label}
    </span>
  )
}
