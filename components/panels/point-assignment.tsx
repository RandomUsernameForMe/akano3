"use client"

import React, { useState, useMemo } from "react"
import { IconCheck, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useGame } from "@/lib/game-context"
import { TEAMS, UNITS, CIRCLES, CHARACTERS } from "@/lib/data"
import { ACTION_LABELS, ACTION_DEFAULT_PTS } from "@/lib/constants"
import { resolveTargetCharacters, getCharName, getTeamName } from "@/lib/utils"
import type { ActionType } from "@/lib/types"

const POINT_CHARS = CHARACTERS.filter(c => c.role === "student" || c.role === "ruze")
type TargetType = "student" | "team" | "unit" | "circle"

export function PointAssignmentForm({
  onClose, canCorrect = false,
}: {
  onClose?: () => void; canCorrect?: boolean
}) {
  const { assignPoints, currentUser, addToast } = useGame()
  const [targetType, setTargetType] = useState<TargetType>("student")
  const [targetId,   setTargetId]   = useState("")
  const [actionType, setActionType] = useState<ActionType>("mission_success")
  const [amount,     setAmount]     = useState(20)
  const [note,       setNote]       = useState("")
  const [confirm,    setConfirm]    = useState(false)

  const targetOptions = useMemo(() => {
    if (targetType === "student") return POINT_CHARS.map(c => ({ id:c.id, label:`${c.name} — ${getTeamName(c.teamId ?? "")}` }))
    if (targetType === "team") return TEAMS.map(t => ({ id:t.id, label:t.name }))
    if (targetType === "unit") return UNITS.map(u => ({ id:u.id, label:u.name }))
    return CIRCLES.map(c => ({ id:c.id, label:c.name }))
  }, [targetType])

  // Recipients (individual students) — each receives the full amount
  const resolvedRecipients = useMemo(() =>
    targetId ? resolveTargetCharacters(targetType, targetId).map(getCharName).join(", ") : "—"
  , [targetType, targetId])

  const actions = (canCorrect
    ? Object.entries(ACTION_LABELS)
    : Object.entries(ACTION_LABELS).filter(([k]) => k !== "correction")
  ) as [ActionType, string][]

  const handleSubmit = () => {
    if (!currentUser) { addToast("Nejsi přihlášen", "error"); return }
    if (!targetId || !amount) { addToast("Vyplň všechna pole", "error"); return }
    assignPoints({
      sourceRole: currentUser.role,
      sourceCharacterId: currentUser.id,
      targetType, targetId, amount, actionType,
      note: note || undefined,
    })
    setTargetId(""); setNote(""); setConfirm(false)
    onClose?.()
  }

  const sectionHead = (label: string) => (
    <p style={{ color:"#6b0f1a", fontSize:"0.72rem", letterSpacing:"0.1em", marginBottom:6, marginTop:16 }}>
      {label}
    </p>
  )

  return (
    <>
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        {sectionHead("CÍL")}
        <RadioGroup
          value={targetType}
          onValueChange={v => { setTargetType(v as TargetType); setTargetId("") }}
          style={{ display:"flex", gap:8, marginBottom:8 }}
        >
          {(["student","team","unit","circle"] as const).map(t => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <RadioGroupItem value={t} id={`tt-${t}`} />
              <Label htmlFor={`tt-${t}`} style={{ color:"#1a0a0a", cursor:"pointer", fontSize:"0.85rem" }}>
                {t==="student" ? "Student" : t==="team" ? "Tým" : t==="unit" ? "Jednotka" : "Kruh"}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Select value={targetId} onValueChange={(v) => setTargetId(v ?? "")}>
          <SelectTrigger style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
            <SelectValue placeholder="Vyber cíl…">
              {targetId ? (targetOptions.find(o => o.id === targetId)?.label ?? targetId) : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {targetOptions.map(o => (
              <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {targetId && (
          <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.75rem", marginTop:4 }}>
            <IconChevronRight size={11} style={{display:"inline"}} /> Každý dostane {amount > 0 ? "+" : ""}{amount} b.: <strong style={{color:"#6b0f1a"}}>{resolvedRecipients}</strong>
          </p>
        )}

        {sectionHead("TYP AKCE")}
        <Select value={actionType} onValueChange={v => {
          setActionType(v as ActionType)
          setAmount(ACTION_DEFAULT_PTS[v as ActionType] || 10)
        }}>
          <SelectTrigger style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {actions.map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        {sectionHead("POČET BODŮ")}
        <Input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          min={canCorrect ? undefined : 1}
          style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}
        />

        {sectionHead("POZNÁMKA (nepovinné)")}
        <Textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Stručný popis…"
          rows={2}
          style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", resize:"none" }}
        />

        <Button
          onClick={() => setConfirm(true)}
          disabled={!targetId}
          style={{ marginTop:20, backgroundColor:"#2a8a8a", color:"#fff", fontWeight:700 }}
        >
          <IconCheck size={16} style={{marginRight:6}} /> Zadat body
        </Button>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Potvrdit zadání bodů</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              <strong style={{color:"#2a8a8a", fontSize:"1.1rem"}}>{amount > 0 ? "+" : ""}{amount} bodů</strong>
              {" → každému: "}<strong>{resolvedRecipients}</strong>
              <br />{ACTION_LABELS[actionType]}
              {note && <><br /><em style={{color:"rgba(107,15,26,0.45)"}}>„{note}"</em></>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} style={{ backgroundColor:"#2a8a8a" }}>Potvrdit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
