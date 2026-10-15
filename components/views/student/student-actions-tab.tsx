"use client"

import { useState, useEffect, useMemo } from "react"
import { IconBook, IconStar, IconCircleCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useGame } from "@/lib/game-context"
import { getTeamName, formatDateTime, getCharName, getTargetName } from "@/lib/utils"
import { ACTION_LABELS } from "@/lib/constants"
import type { Character, Team } from "@/lib/types"

const tileStyle = { all:"unset", boxSizing:"border-box", display:"flex", alignItems:"center", gap:20, width:"100%", minHeight:108, borderRadius:20, padding:"24px", transition:"all 0.2s" } as const
const titleStyle = { fontSize:"1.25rem", fontWeight:800, lineHeight:1.2, margin:0 } as const
const subStyle = { fontSize:"0.88rem", margin:"5px 0 0" } as const
const inputStyle = { backgroundColor:"var(--c-input)", border:"1px solid var(--c-input-border)", height:48, fontSize:"0.95rem" }

export function StudentActionsTab({ student, team }: { student: Character; team?: Team }) {
  const { characters, pointLog, lessonWindowActive, lessonWindowEnd, claimLesson, giftPoints } = useGame()
  const [giftTarget,    setGiftTarget]    = useState("")
  const [giftAmount,    setGiftAmount]    = useState(5)
  const [giftConfirm,   setGiftConfirm]   = useState(false)
  const [giftSheetOpen, setGiftSheetOpen] = useState(false)
  const [lessonConfirm, setLessonConfirm] = useState(false)
  const [lessonCountdown, setLessonCountdown] = useState("")

  const pool           = student.peerPointPool ?? 0
  const teammates      = useMemo(() => characters.filter(c => c.role === "student" && c.id !== student.id), [characters, student.id])
  const giftTargetChar = characters.find(c => c.id === giftTarget)

  useEffect(() => {
    if (!lessonWindowEnd) return
    const iv = setInterval(() => {
      const diff = lessonWindowEnd.getTime() - Date.now()
      if (diff <= 0) { setLessonCountdown("Vypršelo"); clearInterval(iv); return }
      const m = Math.floor(diff / 60000), s = Math.floor((diff % 60000) / 1000)
      setLessonCountdown(`${m}:${String(s).padStart(2,"0")}`)
    }, 1000)
    return () => clearInterval(iv)
  }, [lessonWindowEnd])

  const claimed = student.lessonClaimedThisWindow
  const lessonOn = lessonWindowActive && !claimed
  const teamLog = pointLog
    .filter(e => team && e.resolvedTeamIds.includes(team.id))
    .slice(0, 30)

  return (
    <>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {/* Lesson tile */}
        <button disabled={!lessonWindowActive || claimed} onClick={() => setLessonConfirm(true)}
          style={{ ...tileStyle, backgroundColor: lessonOn ? "var(--c-teal)" : "var(--c-bg-section)", border: `2px solid ${lessonOn ? "var(--c-teal)" : "var(--c-border)"}`, cursor: lessonOn ? "pointer" : "default" }}>
          {claimed
            ? <IconCircleCheck size={44} color="var(--c-text-muted)" strokeWidth={1.4} />
            : <IconBook size={44} color={lessonWindowActive ? "#F4ECDF" : "var(--c-text-muted)"} strokeWidth={1.4} />
          }
          <div>
            <p style={{ ...titleStyle, color: lessonOn ? "#F4ECDF" : "var(--c-text-muted)" }}>Body za hodinu</p>
            <p style={{ ...subStyle, color: lessonOn ? "rgba(255,255,255,0.72)" : "var(--c-text-muted)" }}>
              {claimed ? "Již uplatněno v tomto okně" : lessonWindowActive ? `+5 bodů · zavírá za ${lessonCountdown}` : "Okno není aktivní"}
            </p></div>
        </button>
        {/* Gift tile */}
        <button disabled={pool <= 0} onClick={() => setGiftSheetOpen(true)}
          style={{ ...tileStyle, backgroundColor: pool > 0 ? "var(--c-accent)" : "var(--c-bg-section)", border: `2px solid ${pool > 0 ? "var(--c-accent)" : "var(--c-border)"}`, cursor: pool <= 0 ? "default" : "pointer" }}>
          <IconStar size={44} color={pool > 0 ? "#d4a017" : "var(--c-text-muted)"} strokeWidth={1.4} />
          <div>
            <p style={{ ...titleStyle, color: pool > 0 ? "#F4ECDF" : "var(--c-text-muted)" }}>Darovat body</p>
            <p style={{ ...subStyle, color: pool > 0 ? "rgba(255,255,255,0.65)" : "var(--c-text-muted)" }}>{pool > 0 ? `Zbývá ti ${student.peerPointPool} bodů` : "Nemáš body k darování"}</p>
          </div></button>
        <Sheet open={giftSheetOpen} onOpenChange={setGiftSheetOpen}>
          <SheetContent side="bottom" style={{ backgroundColor:"var(--c-bg-section)", border:"1px solid var(--c-border)", borderRadius:"20px 20px 0 0", padding:"24px 20px 40px", }}>
            <SheetHeader style={{ marginBottom:20 }}>
              <SheetTitle style={{ color:"var(--c-text)", fontSize:"1.3rem" }}>Darovat body</SheetTitle>
            </SheetHeader>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:"0.8rem", color:"var(--c-text-muted)" }}>Zbývá ti</span><span style={{ fontFamily:"monospace", fontWeight:900, fontSize:"1.5rem", color: pool > 0 ? "var(--c-teal)" : "var(--destructive)" }}>{pool} bodů</span>              </div>
              <Progress value={(pool / 20) * 100} style={{ height:6, marginBottom:4, backgroundColor:"var(--c-border)" }} />
              <Select value={giftTarget} onValueChange={(v) => setGiftTarget(v ?? "")}>
                <SelectTrigger style={inputStyle}><SelectValue placeholder="Vyber spolužáka…" /></SelectTrigger>
                <SelectContent>
                  {teammates.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} — {getTeamName(c.teamId ?? "")}</SelectItem>
                  ))}
                </SelectContent></Select>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <Input type="number" value={giftAmount} onChange={e => setGiftAmount(Math.min(pool, Math.max(1, Number(e.target.value))))} min={1} max={pool} style={{ ...inputStyle, width:110 }} />
                <span style={{ color:"var(--c-text-muted)", fontSize:"0.85rem" }}>max {pool}</span>
              </div>
              <Button
                disabled={!giftTarget || giftAmount <= 0 || pool <= 0}
                onClick={() => { setGiftSheetOpen(false); setGiftConfirm(true) }}
                style={{ backgroundColor:"var(--c-accent)", color:"#F4ECDF", height:56, fontSize:"1.05rem", fontWeight:700, borderRadius:14 }}
              >
                Darovat {giftAmount} {giftAmount === 1 ? "bod" : giftAmount < 5 ? "body" : "bodů"}
              </Button>
            </div>
          </SheetContent></Sheet>
        {/* Team point log */}
        <div style={{ marginTop:24 }}>
          <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"var(--c-text-muted)", marginBottom:10 }}>LOG BODŮ TÝMU</p>
          {teamLog.length === 0 && <p style={{ color:"var(--c-text-muted)", fontSize:"0.85rem", textAlign:"center", padding:"20px 0" }}>Žádné záznamy</p>}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {teamLog.map(e => (
              <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, backgroundColor:"var(--c-bg-card)", borderRadius:6, padding:"10px 14px", border:"2px solid var(--c-border-mid)", boxShadow:"var(--shadow-print-sm)", }}>
                <span style={{ minWidth:44, textAlign:"center", fontFamily:"monospace", fontWeight:900, fontSize:"1rem", color: e.amount > 0 ? "var(--c-success)" : "var(--destructive)", }}>
                  {e.amount > 0 ? "+" : ""}{e.amount}
                </span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontSize:"0.85rem", fontWeight:600, color:"var(--c-text)" }}>{ACTION_LABELS[e.actionType]}</p>
                  <p style={{ margin:"2px 0 0", fontSize:"0.72rem", color:"var(--c-text-muted)" }}>
                    {getCharName(e.sourceCharacterId)} → {getTargetName(e.targetType, e.targetId)}
                    {e.note && <span> · {e.note}</span>}
                  </p></div>
                <span style={{ fontSize:"0.68rem", color:"var(--c-text-muted)", fontFamily:"monospace", flexShrink:0 }}>{formatDateTime(e.timestamp)}</span>
              </div>
            ))}
          </div></div>
      </div>
      {/* Lesson confirm */}
      <AlertDialog open={lessonConfirm} onOpenChange={setLessonConfirm}>
        <AlertDialogContent style={{ backgroundColor:"var(--c-bg-card)", border:"1px solid var(--c-border-mid)" }}>
          <AlertDialogHeader><AlertDialogTitle style={{ color:"var(--c-text)" }}>Potvrdit body za hodinu</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"var(--c-accent)" }}>
              Získáš <strong style={{color:"var(--c-teal)"}}>+5 bodů</strong> pro sebe (pomůžou i týmu <strong>{team?.name}</strong>).
              V tomto okně lze uplatnit pouze jednou.
            </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel style={{ borderColor:"var(--c-border-mid)", color:"var(--c-accent)" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => { claimLesson(student.id); setLessonConfirm(false) }} style={{ backgroundColor:"var(--c-teal)", color:"#F4ECDF" }}>Potvrdit</AlertDialogAction>
          </AlertDialogFooter></AlertDialogContent></AlertDialog>
      {/* Gift confirm */}
      <AlertDialog open={giftConfirm} onOpenChange={setGiftConfirm}>
        <AlertDialogContent style={{ backgroundColor:"var(--c-bg-card)", border:"1px solid var(--c-border-mid)" }}>
          <AlertDialogHeader><AlertDialogTitle style={{ color:"var(--c-text)" }}>Darovat body</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"var(--c-accent)" }}>
              Darovat <strong style={{color:"var(--c-teal)"}}>{giftAmount} bodů</strong> hráči{" "}
              <strong>{giftTargetChar?.name}</strong> ({getTeamName(giftTargetChar?.teamId ?? "")})?
              <br />Ze svého poolu zbyde <strong>{pool - giftAmount} bodů</strong>. </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel style={{ borderColor:"var(--c-border-mid)", color:"var(--c-accent)" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              giftPoints(student.id, giftTarget, giftAmount)
              setGiftTarget(""); setGiftConfirm(false)
            }} style={{ backgroundColor:"var(--c-accent)", color:"#F4ECDF" }}>
              Darovat
            </AlertDialogAction>
          </AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  )
}