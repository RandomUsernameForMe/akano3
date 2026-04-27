"use client"

import React, { useState, useEffect } from "react"
import {
  IconUser, IconUsers, IconTrophy, IconTarget, IconList, IconChartLine,
  IconBook, IconStar, IconCircleCheck,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGame } from "@/lib/game-context"
import { TEAMS, CHARACTERS } from "@/lib/data"
import { romanNumeral, getTeamName, formatDateTime, getCharName, getTargetName } from "@/lib/utils"
import { ACTION_LABELS } from "@/lib/constants"
import { ScoreboardComponent } from "@/components/panels/scoreboard"
import { ChartsPanel } from "@/components/panels/charts"
import { TeamIcon } from "@/components/shared/team-icon"
import { SpecBadge, RoleBadge } from "@/components/shared/badges"

export function StudentDashboard() {
  const { currentUser, characters, teams, pointLog, lessonWindowActive, lessonWindowEnd, claimLesson, giftPoints } = useGame()
  const student  = characters.find(c => c.id === currentUser?.id)
  const team     = teams.find(t => t.id === student?.teamId)
  const teamRank = [...teams].sort((a,b)=>b.points-a.points).findIndex(t=>t.id===student?.teamId) + 1

  const [sbView,        setSbView]        = useState<"table" | "chart">("table")
  const [giftTarget,    setGiftTarget]    = useState("")
  const [giftAmount,    setGiftAmount]    = useState(5)
  const [giftConfirm,   setGiftConfirm]   = useState(false)
  const [giftSheetOpen, setGiftSheetOpen] = useState(false)
  const [lessonConfirm, setLessonConfirm] = useState(false)

  const teammates      = characters.filter(c => c.role === "student" && c.id !== student?.id)
  const giftTargetChar = characters.find(c => c.id === giftTarget)

  const [lessonCountdown, setLessonCountdown] = useState("")
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

  if (!student) return null

  const specColors: Record<string, string> = { combat:"#e05252", tactical:"#5268e0", support:"#52d4b4" }
  const specColor  = student.specialization ? specColors[student.specialization] : null
  const inputStyle = { backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", height:48, fontSize:"0.95rem" }

  return (
    <div style={{ maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", minHeight:"100dvh" }}>

      {/* Sticky character header */}
      <div style={{
        position:"sticky", top:0, zIndex:20,
        backgroundColor:"var(--c-topbar)",
        borderBottom:"1px solid var(--c-border)",
        padding:"18px 20px 16px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {specColor && (
            <div style={{ width:5, alignSelf:"stretch", borderRadius:3, backgroundColor:specColor, flexShrink:0 }} />
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontSize:"1.9rem", fontWeight:900, color:"var(--c-text)", lineHeight:1.1, margin:0 }}>
              {student?.name}
            </h1>
            {team && (
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:5 }}>
                <TeamIcon teamId={team.id} size={16} />
                <span style={{ fontSize:"0.9rem", fontWeight:600, color:"var(--c-text-muted)" }}>{team.name}</span>
                <span style={{ fontSize:"0.8rem", color:"var(--c-text-faint)" }}>#{teamRank}</span>
                {(student?.kaichiLevel ?? 0) > 0 && (
                  <span style={{
                    marginLeft:4,
                    width:22, height:22, borderRadius:"50%",
                    border:"1.5px solid #d4a017", backgroundColor:"#1a0a00",
                    display:"inline-flex", alignItems:"center", justifyContent:"center",
                    fontSize:"0.65rem", color:"#d4a017", fontFamily:"monospace", fontWeight:700,
                  }}>
                    {romanNumeral(student.kaichiLevel)}
                  </span>
                )}
              </div>
            )}
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <p style={{ fontSize:"0.6rem", color:"var(--c-text-muted)", letterSpacing:"0.1em", marginBottom:1 }}>BODY TÝMU</p>
            <p style={{ fontSize:"3.2rem", fontWeight:900, fontFamily:"monospace", color:"var(--c-accent)", lineHeight:1 }}>
              {team?.points ?? 0}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="scoreboard" style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <TabsList style={{
          display:"grid", gridTemplateColumns:"repeat(3,1fr)",
          backgroundColor:"var(--c-topbar)",
          borderBottom:"2px solid var(--c-border)",
          borderRadius:0, padding:0, height:"auto",
          width:"100%",
        }}>
          {([
            ["scoreboard","Žebříček", IconTrophy],
            ["people",    "Lidé",     IconUsers],
            ["actions",   "Body",     IconTarget],
          ] as [string, string, React.ElementType][]).map(([v, label, Icon]) => (
            <TabsTrigger
              key={v}
              value={v}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:5, padding:"14px 4px 12px", minHeight:72,
                fontSize:"0.78rem", fontWeight:700, borderRadius:0,
                color:"rgba(107,15,26,0.4)",
                letterSpacing:"0.02em",
              }}
            >
              <Icon size={26} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div style={{ padding:"20px 16px 32px" }}>

          {/* ŽEBŘÍČEK */}
          <TabsContent value="scoreboard">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"rgba(107,15,26,0.4)", margin:0 }}>AKTUÁLNÍ ŽEBŘÍČEK</p>
              <div style={{ display:"flex", gap:4 }}>
                {(["table","chart"] as const).map(v => (
                  <button key={v} onClick={() => setSbView(v)} style={{
                    all:"unset", boxSizing:"border-box",
                    padding:"5px 10px", borderRadius:8, cursor:"pointer",
                    backgroundColor: sbView === v ? "#6b0f1a" : "transparent",
                    color: sbView === v ? "#fff" : "rgba(107,15,26,0.4)",
                    border: `1px solid ${sbView === v ? "#6b0f1a" : "rgba(107,15,26,0.18)"}`,
                    display:"flex", alignItems:"center",
                  }}>
                    {v === "table" ? <IconList size={16} /> : <IconChartLine size={16} />}
                  </button>
                ))}
              </div>
            </div>
            {sbView === "table"
              ? <ScoreboardComponent highlightId={student?.teamId} />
              : <ChartsPanel />
            }
          </TabsContent>

          {/* LIDÉ */}
          <TabsContent value="people">
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {TEAMS.map(t => {
                const members = CHARACTERS.filter(c => c.teamId === t.id && (c.role === "student" || c.role === "ruze"))
                if (!members.length) return null
                return (
                  <div key={t.id}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                      <TeamIcon teamId={t.id} size={16} />
                      <span style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.08em", color:"rgba(107,15,26,0.45)" }}>
                        {t.name.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {members.map(c => (
                        <div key={c.id} style={{
                          display:"flex", alignItems:"center", gap:12,
                          backgroundColor:"#fff", borderRadius:14, padding:"12px 16px",
                          border: c.id === student?.id
                            ? "1.5px solid rgba(42,138,138,0.45)"
                            : "1px solid rgba(107,15,26,0.08)",
                        }}>
                          <div style={{
                            width:40, height:40, borderRadius:"50%", flexShrink:0,
                            backgroundColor: c.id === student?.id ? "rgba(42,138,138,0.1)" : "rgba(107,15,26,0.05)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            <IconUser size={20} color={c.id === student?.id ? "#2a8a8a" : "rgba(107,15,26,0.28)"} />
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <span style={{ fontWeight:700, fontSize:"0.95rem", color:"#1a0a0a" }}>{c.name}</span>
                              {c.id === student?.id && (
                                <span style={{ fontSize:"0.65rem", color:"#2a8a8a", backgroundColor:"rgba(42,138,138,0.1)", padding:"1px 7px", borderRadius:20 }}>ty</span>
                              )}
                            </div>
                            {c.nickname && (
                              <p style={{ color:"rgba(107,15,26,0.38)", fontSize:"0.75rem", fontStyle:"italic", margin:0 }}>„{c.nickname}"</p>
                            )}
                          </div>
                          <SpecBadge spec={c.specialization} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div>
                <div style={{ marginBottom:8 }}>
                  <span style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.08em", color:"rgba(107,15,26,0.45)" }}>
                    DOSPĚLÍ
                  </span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {CHARACTERS.filter(c => c.role === "teacher" || c.role === "gm").map(c => (
                    <div key={c.id} style={{
                      display:"flex", alignItems:"center", gap:12,
                      backgroundColor:"#fff", borderRadius:14, padding:"12px 16px",
                      border:"1px solid rgba(107,15,26,0.08)",
                    }}>
                      <div style={{
                        width:40, height:40, borderRadius:"50%", flexShrink:0,
                        backgroundColor:"rgba(107,15,26,0.05)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <IconUser size={20} color="rgba(107,15,26,0.28)" />
                      </div>
                      <div style={{ flex:1 }}>
                        <span style={{ fontWeight:700, fontSize:"0.95rem", color:"#1a0a0a" }}>{c.name}</span>
                      </div>
                      <RoleBadge role={c.role} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AKCE */}
          <TabsContent value="actions">
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Lesson tile */}
              <button
                disabled={!lessonWindowActive || student?.lessonClaimedThisWindow}
                onClick={() => setLessonConfirm(true)}
                style={{
                  all:"unset", boxSizing:"border-box",
                  display:"flex", alignItems:"center", gap:20,
                  width:"100%", minHeight:108, borderRadius:20, padding:"24px",
                  backgroundColor: student?.lessonClaimedThisWindow
                    ? "rgba(107,15,26,0.04)"
                    : lessonWindowActive ? "#2a8a8a" : "rgba(107,15,26,0.06)",
                  border: `2px solid ${
                    student?.lessonClaimedThisWindow
                      ? "rgba(107,15,26,0.1)"
                      : lessonWindowActive ? "#2a8a8a" : "rgba(107,15,26,0.12)"
                  }`,
                  cursor: (!lessonWindowActive || student?.lessonClaimedThisWindow) ? "default" : "pointer",
                  transition:"all 0.2s",
                }}
              >
                {student?.lessonClaimedThisWindow
                  ? <IconCircleCheck size={44} color="rgba(107,15,26,0.22)" strokeWidth={1.4} />
                  : <IconBook size={44} color={lessonWindowActive ? "#fff" : "rgba(107,15,26,0.22)"} strokeWidth={1.4} />
                }
                <div>
                  <p style={{
                    fontSize:"1.25rem", fontWeight:800, lineHeight:1.2, margin:0,
                    color: student?.lessonClaimedThisWindow
                      ? "rgba(107,15,26,0.3)"
                      : lessonWindowActive ? "#fff" : "rgba(107,15,26,0.35)",
                  }}>
                    Body za hodinu
                  </p>
                  <p style={{
                    fontSize:"0.88rem", margin:"5px 0 0",
                    color: student?.lessonClaimedThisWindow
                      ? "rgba(107,15,26,0.22)"
                      : lessonWindowActive ? "rgba(255,255,255,0.72)" : "rgba(107,15,26,0.3)",
                  }}>
                    {student?.lessonClaimedThisWindow
                      ? "Již uplatněno v tomto okně"
                      : lessonWindowActive
                        ? `+5 bodů · zavírá za ${lessonCountdown}`
                        : "Okno není aktivní"
                    }
                  </p>
                </div>
              </button>

              {/* Gift tile */}
              <button
                disabled={(student?.peerPointPool ?? 0) <= 0}
                onClick={() => setGiftSheetOpen(true)}
                style={{
                  all:"unset", boxSizing:"border-box",
                  display:"flex", alignItems:"center", gap:20,
                  width:"100%", minHeight:108, borderRadius:20, padding:"24px",
                  backgroundColor: (student?.peerPointPool ?? 0) > 0 ? "#6b0f1a" : "rgba(107,15,26,0.06)",
                  border: `2px solid ${(student?.peerPointPool ?? 0) > 0 ? "#6b0f1a" : "rgba(107,15,26,0.12)"}`,
                  cursor: (student?.peerPointPool ?? 0) <= 0 ? "default" : "pointer",
                  transition:"all 0.2s",
                }}
              >
                <IconStar size={44} color={(student?.peerPointPool ?? 0) > 0 ? "#d4a017" : "rgba(107,15,26,0.22)"} strokeWidth={1.4} />
                <div>
                  <p style={{
                    fontSize:"1.25rem", fontWeight:800, lineHeight:1.2, margin:0,
                    color: (student?.peerPointPool ?? 0) > 0 ? "#fff" : "rgba(107,15,26,0.35)",
                  }}>
                    Darovat body
                  </p>
                  <p style={{
                    fontSize:"0.88rem", margin:"5px 0 0",
                    color: (student?.peerPointPool ?? 0) > 0 ? "rgba(255,255,255,0.65)" : "rgba(107,15,26,0.3)",
                  }}>
                    {(student?.peerPointPool ?? 0) > 0
                      ? `Zbývá ti ${student?.peerPointPool} bodů`
                      : "Nemáš body k darování"}
                  </p>
                </div>
              </button>

              <Sheet open={giftSheetOpen} onOpenChange={setGiftSheetOpen}>
                <SheetContent side="bottom" style={{
                  backgroundColor:"#f0f8f8",
                  border:"1px solid rgba(107,15,26,0.15)",
                  borderRadius:"20px 20px 0 0",
                  padding:"24px 20px 40px",
                }}>
                  <SheetHeader style={{ marginBottom:20 }}>
                    <SheetTitle style={{ color:"#1a0a0a", fontSize:"1.3rem" }}>Darovat body</SheetTitle>
                  </SheetHeader>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:"0.8rem", color:"rgba(107,15,26,0.5)" }}>Zbývá ti</span>
                      <span style={{ fontFamily:"monospace", fontWeight:900, fontSize:"1.5rem",
                        color:(student?.peerPointPool ?? 0) > 0 ? "#2a8a8a" : "#e05252" }}>
                        {student?.peerPointPool ?? 0} bodů
                      </span>
                    </div>
                    <Progress value={((student?.peerPointPool ?? 0) / 20) * 100}
                      style={{ height:6, marginBottom:4, backgroundColor:"rgba(107,15,26,0.08)" }} />
                    <Select value={giftTarget} onValueChange={(v) => setGiftTarget(v ?? "")}>
                      <SelectTrigger style={inputStyle}><SelectValue placeholder="Vyber spolužáka…" /></SelectTrigger>
                      <SelectContent>
                        {teammates.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} — {getTeamName(c.teamId ?? "")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <Input type="number" value={giftAmount}
                        onChange={e => setGiftAmount(Math.min(student?.peerPointPool ?? 0, Math.max(1, Number(e.target.value))))}
                        min={1} max={student?.peerPointPool ?? 0}
                        style={{ ...inputStyle, width:110 }} />
                      <span style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.85rem" }}>
                        max {student?.peerPointPool ?? 0}
                      </span>
                    </div>
                    <Button
                      disabled={!giftTarget || giftAmount <= 0 || (student?.peerPointPool ?? 0) <= 0}
                      onClick={() => { setGiftSheetOpen(false); setGiftConfirm(true) }}
                      style={{ backgroundColor:"#6b0f1a", color:"#fff", height:56, fontSize:"1.05rem", fontWeight:700, borderRadius:14 }}
                    >
                      Darovat {giftAmount} {giftAmount === 1 ? "bod" : giftAmount < 5 ? "body" : "bodů"}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Team point log */}
              {(() => {
                const teamLog = pointLog
                  .filter(e => team && e.resolvedTeamIds.includes(team.id))
                  .slice(0, 30)
                return (
                  <div style={{ marginTop:24 }}>
                    <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"rgba(107,15,26,0.4)", marginBottom:10 }}>
                      LOG BODŮ TÝMU
                    </p>
                    {teamLog.length === 0 && (
                      <p style={{ color:"rgba(107,15,26,0.3)", fontSize:"0.85rem", textAlign:"center", padding:"20px 0" }}>
                        Žádné záznamy
                      </p>
                    )}
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {teamLog.map(e => (
                        <div key={e.id} style={{
                          display:"flex", alignItems:"center", gap:12,
                          backgroundColor:"#fff", borderRadius:12, padding:"10px 14px",
                          border:"1px solid rgba(107,15,26,0.08)",
                        }}>
                          <span style={{
                            minWidth:44, textAlign:"center",
                            fontFamily:"monospace", fontWeight:900, fontSize:"1rem",
                            color: e.amount > 0 ? "#2a8a5a" : "#e05252",
                          }}>
                            {e.amount > 0 ? "+" : ""}{e.amount}
                          </span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ margin:0, fontSize:"0.85rem", fontWeight:600, color:"#1a0a0a" }}>
                              {ACTION_LABELS[e.actionType]}
                            </p>
                            <p style={{ margin:"2px 0 0", fontSize:"0.72rem", color:"rgba(107,15,26,0.45)" }}>
                              {getCharName(e.sourceCharacterId)} → {getTargetName(e.targetType, e.targetId)}
                              {e.note && <span> · {e.note}</span>}
                            </p>
                          </div>
                          <span style={{ fontSize:"0.68rem", color:"rgba(107,15,26,0.3)", fontFamily:"monospace", flexShrink:0 }}>
                            {formatDateTime(e.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

            </div>
          </TabsContent>

        </div>
      </Tabs>

      {/* Lesson confirm */}
      <AlertDialog open={lessonConfirm} onOpenChange={setLessonConfirm}>
        <AlertDialogContent style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Potvrdit body za hodinu</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              Získáš <strong style={{color:"#2a8a8a"}}>+5 bodů</strong> pro tým <strong>{team?.name}</strong>.
              V tomto okně lze uplatnit pouze jednou.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (student) { claimLesson(student.id); setLessonConfirm(false) } }}
              style={{ backgroundColor:"#2a8a8a", color:"#fff" }}>Potvrdit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Gift confirm */}
      <AlertDialog open={giftConfirm} onOpenChange={setGiftConfirm}>
        <AlertDialogContent style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Darovat body</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              Darovat <strong style={{color:"#2a8a8a"}}>{giftAmount} bodů</strong> hráči{" "}
              <strong>{giftTargetChar?.name}</strong> ({getTeamName(giftTargetChar?.teamId ?? "")})?
              <br />Ze svého poolu zbyde <strong>{(student?.peerPointPool ?? 0) - giftAmount} bodů</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (student) giftPoints(student.id, giftTarget, giftAmount)
              setGiftTarget(""); setGiftConfirm(false)
            }} style={{ backgroundColor:"#6b0f1a", color:"#fff" }}>
              Darovat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
