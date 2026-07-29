"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
  IconUser, IconUsers, IconTrophy, IconTarget, IconList, IconChartLine,
  IconBook, IconStar, IconCircleCheck, IconBooks, IconChevronDown, IconChevronRight,
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
import type { WikiArticle } from "@/lib/types"
import { WikiRenderer } from "@/components/shared/wiki-renderer"

export function StudentDashboard() {
  const { currentUser, characters, teams, pointLog, lessonWindowActive, lessonWindowEnd, claimLesson, giftPoints } = useGame()
  const student  = characters.find(c => c.id === currentUser?.id)
  const team     = teams.find(t => t.id === student?.teamId)
  const teamRank = useMemo(() => [...teams].sort((a,b)=>b.points-a.points).findIndex(t=>t.id===student?.teamId) + 1, [teams, student?.teamId])

  const [sbView,        setSbView]        = useState<"table" | "chart">("table")
  const [sbMode,        setSbMode]        = useState<"students" | "teams" | "units" | "circles">("teams")
  const [giftTarget,    setGiftTarget]    = useState("")
  const [giftAmount,    setGiftAmount]    = useState(5)
  const [giftConfirm,   setGiftConfirm]   = useState(false)
  const [giftSheetOpen, setGiftSheetOpen] = useState(false)
  const [lessonConfirm, setLessonConfirm] = useState(false)

  // Wiki state
  const [wikiArticles,  setWikiArticles]  = useState<WikiArticle[]>([])
  const [wikiLoading,   setWikiLoading]   = useState(false)
  const [wikiExpanded,  setWikiExpanded]  = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const teammates      = useMemo(() => characters.filter(c => c.role === "student" && c.id !== student?.id), [characters, student?.id])
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

  const loadWiki = useCallback(async () => {
    if (!student?.id) return
    setWikiLoading(true)
    try {
      const res = await fetch(`/api/wiki?characterId=${student.id}`)
      if (res.ok) {
        const data: WikiArticle[] = await res.json()
        setWikiArticles(data)
        // auto-open first category
        if (data.length > 0) {
          setOpenCategories(new Set([data[0].category]))
        }
      }
    } finally {
      setWikiLoading(false)
    }
  }, [student?.id])

  if (!student) return null

  const specColors: Record<string, string> = { combat:"#e05252", tactical:"#5268e0", support:"#52d4b4" }
  const specColor  = student.specialization ? specColors[student.specialization] : null
  const inputStyle = { backgroundColor:"var(--c-input)", border:"1px solid var(--c-input-border)", height:48, fontSize:"0.95rem" }

  const wikiCategories = [...new Set(wikiArticles.map(a => a.category))]

  function toggleCategory(cat: string) {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return next
    })
    setWikiExpanded(null)
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100dvh" }}>

      {/* Sticky character header */}
      <div style={{
        position:"sticky", top:0, zIndex:20,
        backgroundColor:"var(--c-topbar)",
        borderBottom:"1px solid var(--c-border)",
        padding:"14px 28px 12px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {specColor && (
            <div style={{ width:5, alignSelf:"stretch", borderRadius:3, backgroundColor:specColor, flexShrink:0 }} />
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontSize:"1.7rem", fontWeight:900, color:"var(--c-text)", lineHeight:1.1, margin:0 }}>
              {student?.name}
            </h1>
            {team && (
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                <TeamIcon teamId={team.id} size={15} />
                <span style={{ fontSize:"0.88rem", fontWeight:600, color:"var(--c-text-muted)" }}>{team.name}</span>
                <span style={{ fontSize:"0.78rem", color:"var(--c-text-faint)" }}>#{teamRank}</span>
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
            <p style={{ fontSize:"0.6rem", color:"var(--c-text-muted)", letterSpacing:"0.1em", marginBottom:1 }}>TVÉ BODY</p>
            <p style={{ fontSize:"2.8rem", fontWeight:900, fontFamily:"monospace", color:"var(--c-accent)", lineHeight:1 }}>
              {student?.points ?? 0}
            </p>
            <p style={{ fontSize:"0.68rem", color:"var(--c-text-muted)", marginTop:2 }}>
              tým {team?.points ?? 0} b.
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
            ["wiki",      "Informace", IconBooks],
          ] as [string, string, React.ElementType][]).map(([v, label, Icon]) => (
            <TabsTrigger
              key={v}
              value={v}
              onClick={v === "wiki" ? loadWiki : undefined}
              style={{
                display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center",
                gap:8, padding:"10px 16px", minHeight:48,
                fontSize:"0.82rem", fontWeight:700, borderRadius:0,
                color:"var(--c-text-muted)",
                letterSpacing:"0.02em",
              }}
            >
              <Icon size={18} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div style={{ padding:"20px 24px 40px" }}>

          {/* ŽEBŘÍČEK */}
          <TabsContent value="scoreboard">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"var(--c-text-muted)", margin:0 }}>AKTUÁLNÍ ŽEBŘÍČEK</p>
              <div style={{ display:"flex", gap:4 }}>
                {(["table","chart"] as const).map(v => (
                  <button key={v} onClick={() => setSbView(v)} style={{
                    all:"unset", boxSizing:"border-box",
                    padding:"5px 10px", borderRadius:8, cursor:"pointer",
                    backgroundColor: sbView === v ? "var(--c-accent)" : "transparent",
                    color: sbView === v ? "#F4ECDF" : "var(--c-text-muted)",
                    border: `1px solid ${sbView === v ? "var(--c-accent)" : "var(--c-border-mid)"}`,
                    display:"flex", alignItems:"center",
                  }}>
                    {v === "table" ? <IconList size={16} /> : <IconChartLine size={16} />}
                  </button>
                ))}
              </div>
            </div>
            {sbView === "table"
              ? <ScoreboardComponent
                  mode={sbMode}
                  showModeToggle
                  onModeChange={setSbMode}
                  highlightId={sbMode === "students" ? student?.id : student?.teamId}
                />
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
                      <span style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.08em", color:"var(--c-text-muted)" }}>
                        {t.name.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {members.map(c => (
                        <div key={c.id} style={{
                          display:"flex", alignItems:"center", gap:12,
                          backgroundColor:"var(--c-bg-card)", borderRadius:6, padding:"12px 16px",
                          border: c.id === student?.id
                            ? "2px solid rgba(16,128,128,0.45)"
                            : "2px solid var(--c-border-mid)",
                          boxShadow:"var(--shadow-print-sm)",
                        }}>
                          <div style={{
                            width:40, height:40, borderRadius:"50%", flexShrink:0,
                            backgroundColor: c.id === student?.id ? "rgba(16,128,128,0.1)" : "var(--c-bg-section)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            <IconUser size={20} color={c.id === student?.id ? "var(--c-teal)" : "var(--c-text-muted)"} />
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--c-text)" }}>{c.name}</span>
                              {c.id === student?.id && (
                                <span style={{ fontSize:"0.65rem", color:"var(--c-teal)", backgroundColor:"rgba(16,128,128,0.1)", padding:"1px 7px", borderRadius:20 }}>ty</span>
                              )}
                            </div>
                            {c.nickname && (
                              <p style={{ color:"var(--c-text-muted)", fontSize:"0.75rem", fontStyle:"italic", margin:0 }}>„{c.nickname}"</p>
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
                  <span style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.08em", color:"var(--c-text-muted)" }}>
                    DOSPĚLÍ
                  </span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {CHARACTERS.filter(c => c.role === "teacher" || c.role === "gm").map(c => (
                    <div key={c.id} style={{
                      display:"flex", alignItems:"center", gap:12,
                      backgroundColor:"var(--c-bg-card)", borderRadius:6, padding:"12px 16px",
                      border:"2px solid var(--c-border-mid)",
                      boxShadow:"var(--shadow-print-sm)",
                    }}>
                      <div style={{
                        width:40, height:40, borderRadius:"50%", flexShrink:0,
                        backgroundColor:"var(--c-bg-section)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <IconUser size={20} color="var(--c-text-muted)" />
                      </div>
                      <div style={{ flex:1 }}>
                        <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--c-text)" }}>{c.name}</span>
                      </div>
                      <RoleBadge role={c.role} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* INFORMACE (wiki) */}
          <TabsContent value="wiki">
            {wikiLoading ? (
              <p style={{ color:"var(--c-text-muted)", textAlign:"center", padding:"40px 0" }}>Načítám…</p>
            ) : wikiArticles.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                <IconBooks size={48} color="var(--c-text-faint)" strokeWidth={1.2} />
                <p style={{ color:"var(--c-text-muted)", fontSize:"0.9rem" }}>Zatím žádné informace k dispozici.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {wikiCategories.map(cat => {
                  const catArticles = wikiArticles.filter(a => a.category === cat)
                  const isOpen = openCategories.has(cat)
                  return (
                    <div key={cat} style={{
                      backgroundColor:"var(--c-bg-card)", borderRadius:6,
                      border:"2px solid var(--c-border-mid)",
                      boxShadow:"var(--shadow-print-sm)",
                      overflow:"hidden",
                    }}>
                      {/* Category header */}
                      <button
                        onClick={() => toggleCategory(cat)}
                        style={{
                          all:"unset", boxSizing:"border-box", width:"100%",
                          display:"flex", alignItems:"center", justifyContent:"space-between",
                          padding:"14px 20px", cursor:"pointer",
                          backgroundColor: isOpen ? "var(--c-bg-section)" : "transparent",
                        }}
                      >
                        <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--c-text)" }}>{cat}</span>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:"0.72rem", color:"var(--c-text-muted)" }}>
                            {catArticles.length} {catArticles.length === 1 ? "článek" : catArticles.length < 5 ? "články" : "článků"}
                          </span>
                          {isOpen
                            ? <IconChevronDown size={16} color="var(--c-text-muted)" />
                            : <IconChevronRight size={16} color="var(--c-text-muted)" />
                          }
                        </div>
                      </button>

                      {/* Articles in category */}
                      {isOpen && (
                        <div style={{ borderTop:"1px solid var(--c-border)" }}>
                          {catArticles.map((article, idx) => {
                            const isArticleOpen = wikiExpanded === String(article.id)
                            return (
                              <div key={article.id} style={{
                                borderTop: idx > 0 ? "1px solid var(--c-border)" : undefined,
                              }}>
                                <button
                                  onClick={() => setWikiExpanded(isArticleOpen ? null : String(article.id))}
                                  style={{
                                    all:"unset", boxSizing:"border-box", width:"100%",
                                    display:"flex", alignItems:"center", gap:12,
                                    padding:"12px 20px 12px 28px", cursor:"pointer",
                                  }}
                                >
                                  {article.kaichiRequired > 0 && (
                                    <span style={{
                                      width:20, height:20, borderRadius:"50%",
                                      border:"1px solid #d4a017", backgroundColor:"#1a0a00",
                                      display:"inline-flex", alignItems:"center", justifyContent:"center",
                                      fontSize:"0.55rem", color:"#d4a017", fontFamily:"monospace", fontWeight:700,
                                      flexShrink:0,
                                    }}>
                                      {romanNumeral(article.kaichiRequired)}
                                    </span>
                                  )}
                                  <span style={{ flex:1, fontWeight:600, fontSize:"0.9rem", color:"var(--c-text)", textAlign:"left" }}>
                                    {article.title}
                                  </span>
                                  {isArticleOpen
                                    ? <IconChevronDown size={14} color="var(--c-text-muted)" />
                                    : <IconChevronRight size={14} color="var(--c-text-muted)" />
                                  }
                                </button>
                                {isArticleOpen && (
                                  <div style={{
                                    padding:"16px 28px 24px 28px",
                                    borderTop:"1px solid var(--c-border)",
                                  }}>
                                    <WikiRenderer
                                      content={article.content}
                                      kaichiLevel={student.kaichiLevel ?? 0}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* AKCE — kept in code, tab trigger removed from UI */}
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
                    ? "var(--c-bg-section)"
                    : lessonWindowActive ? "var(--c-teal)" : "var(--c-bg-section)",
                  border: `2px solid ${
                    student?.lessonClaimedThisWindow
                      ? "var(--c-border)"
                      : lessonWindowActive ? "var(--c-teal)" : "var(--c-border)"
                  }`,
                  cursor: (!lessonWindowActive || student?.lessonClaimedThisWindow) ? "default" : "pointer",
                  transition:"all 0.2s",
                }}
              >
                {student?.lessonClaimedThisWindow
                  ? <IconCircleCheck size={44} color="var(--c-text-muted)" strokeWidth={1.4} />
                  : <IconBook size={44} color={lessonWindowActive ? "#F4ECDF" : "var(--c-text-muted)"} strokeWidth={1.4} />
                }
                <div>
                  <p style={{
                    fontSize:"1.25rem", fontWeight:800, lineHeight:1.2, margin:0,
                    color: student?.lessonClaimedThisWindow
                      ? "var(--c-text-muted)"
                      : lessonWindowActive ? "#F4ECDF" : "var(--c-text-muted)",
                  }}>
                    Body za hodinu
                  </p>
                  <p style={{
                    fontSize:"0.88rem", margin:"5px 0 0",
                    color: student?.lessonClaimedThisWindow
                      ? "var(--c-text-muted)"
                      : lessonWindowActive ? "rgba(255,255,255,0.72)" : "var(--c-text-muted)",
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
                  backgroundColor: (student?.peerPointPool ?? 0) > 0 ? "var(--c-accent)" : "var(--c-bg-section)",
                  border: `2px solid ${(student?.peerPointPool ?? 0) > 0 ? "var(--c-accent)" : "var(--c-border)"}`,
                  cursor: (student?.peerPointPool ?? 0) <= 0 ? "default" : "pointer",
                  transition:"all 0.2s",
                }}
              >
                <IconStar size={44} color={(student?.peerPointPool ?? 0) > 0 ? "#d4a017" : "var(--c-text-muted)"} strokeWidth={1.4} />
                <div>
                  <p style={{
                    fontSize:"1.25rem", fontWeight:800, lineHeight:1.2, margin:0,
                    color: (student?.peerPointPool ?? 0) > 0 ? "#F4ECDF" : "var(--c-text-muted)",
                  }}>
                    Darovat body
                  </p>
                  <p style={{
                    fontSize:"0.88rem", margin:"5px 0 0",
                    color: (student?.peerPointPool ?? 0) > 0 ? "rgba(255,255,255,0.65)" : "var(--c-text-muted)",
                  }}>
                    {(student?.peerPointPool ?? 0) > 0
                      ? `Zbývá ti ${student?.peerPointPool} bodů`
                      : "Nemáš body k darování"}
                  </p>
                </div>
              </button>

              <Sheet open={giftSheetOpen} onOpenChange={setGiftSheetOpen}>
                <SheetContent side="bottom" style={{
                  backgroundColor:"var(--c-bg-section)",
                  border:"1px solid var(--c-border)",
                  borderRadius:"20px 20px 0 0",
                  padding:"24px 20px 40px",
                }}>
                  <SheetHeader style={{ marginBottom:20 }}>
                    <SheetTitle style={{ color:"var(--c-text)", fontSize:"1.3rem" }}>Darovat body</SheetTitle>
                  </SheetHeader>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:"0.8rem", color:"var(--c-text-muted)" }}>Zbývá ti</span>
                      <span style={{ fontFamily:"monospace", fontWeight:900, fontSize:"1.5rem",
                        color:(student?.peerPointPool ?? 0) > 0 ? "var(--c-teal)" : "var(--destructive)" }}>
                        {student?.peerPointPool ?? 0} bodů
                      </span>
                    </div>
                    <Progress value={((student?.peerPointPool ?? 0) / 20) * 100}
                      style={{ height:6, marginBottom:4, backgroundColor:"var(--c-border)" }} />
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
                      <span style={{ color:"var(--c-text-muted)", fontSize:"0.85rem" }}>
                        max {student?.peerPointPool ?? 0}
                      </span>
                    </div>
                    <Button
                      disabled={!giftTarget || giftAmount <= 0 || (student?.peerPointPool ?? 0) <= 0}
                      onClick={() => { setGiftSheetOpen(false); setGiftConfirm(true) }}
                      style={{ backgroundColor:"var(--c-accent)", color:"#F4ECDF", height:56, fontSize:"1.05rem", fontWeight:700, borderRadius:14 }}
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
                    <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"var(--c-text-muted)", marginBottom:10 }}>
                      LOG BODŮ TÝMU
                    </p>
                    {teamLog.length === 0 && (
                      <p style={{ color:"var(--c-text-muted)", fontSize:"0.85rem", textAlign:"center", padding:"20px 0" }}>
                        Žádné záznamy
                      </p>
                    )}
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {teamLog.map(e => (
                        <div key={e.id} style={{
                          display:"flex", alignItems:"center", gap:12,
                          backgroundColor:"var(--c-bg-card)", borderRadius:6, padding:"10px 14px",
                          border:"2px solid var(--c-border-mid)",
                          boxShadow:"var(--shadow-print-sm)",
                        }}>
                          <span style={{
                            minWidth:44, textAlign:"center",
                            fontFamily:"monospace", fontWeight:900, fontSize:"1rem",
                            color: e.amount > 0 ? "var(--c-success)" : "var(--destructive)",
                          }}>
                            {e.amount > 0 ? "+" : ""}{e.amount}
                          </span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ margin:0, fontSize:"0.85rem", fontWeight:600, color:"var(--c-text)" }}>
                              {ACTION_LABELS[e.actionType]}
                            </p>
                            <p style={{ margin:"2px 0 0", fontSize:"0.72rem", color:"var(--c-text-muted)" }}>
                              {getCharName(e.sourceCharacterId)} → {getTargetName(e.targetType, e.targetId)}
                              {e.note && <span> · {e.note}</span>}
                            </p>
                          </div>
                          <span style={{ fontSize:"0.68rem", color:"var(--c-text-muted)", fontFamily:"monospace", flexShrink:0 }}>
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
        <AlertDialogContent style={{ backgroundColor:"var(--c-bg-card)", border:"1px solid var(--c-border-mid)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"var(--c-text)" }}>Potvrdit body za hodinu</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"var(--c-accent)" }}>
              Získáš <strong style={{color:"var(--c-teal)"}}>+5 bodů</strong> pro sebe (pomůžou i týmu <strong>{team?.name}</strong>).
              V tomto okně lze uplatnit pouze jednou.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"var(--c-border-mid)", color:"var(--c-accent)" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (student) { claimLesson(student.id); setLessonConfirm(false) } }}
              style={{ backgroundColor:"var(--c-teal)", color:"#F4ECDF" }}>Potvrdit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Gift confirm */}
      <AlertDialog open={giftConfirm} onOpenChange={setGiftConfirm}>
        <AlertDialogContent style={{ backgroundColor:"var(--c-bg-card)", border:"1px solid var(--c-border-mid)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"var(--c-text)" }}>Darovat body</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"var(--c-accent)" }}>
              Darovat <strong style={{color:"var(--c-teal)"}}>{giftAmount} bodů</strong> hráči{" "}
              <strong>{giftTargetChar?.name}</strong> ({getTeamName(giftTargetChar?.teamId ?? "")})?
              <br />Ze svého poolu zbyde <strong>{(student?.peerPointPool ?? 0) - giftAmount} bodů</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"var(--c-border-mid)", color:"var(--c-accent)" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (student) giftPoints(student.id, giftTarget, giftAmount)
              setGiftTarget(""); setGiftConfirm(false)
            }} style={{ backgroundColor:"var(--c-accent)", color:"#F4ECDF" }}>
              Darovat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
