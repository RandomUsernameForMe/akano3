"use client"

import React, { useState } from "react"
import { IconTerminal2 } from "@tabler/icons-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGame } from "@/lib/game-context"
import { CHARACTERS } from "@/lib/data"
import { getTeamName } from "@/lib/utils"
import { StudentDashboard } from "./student-dashboard"

const RUZE_LIMIT = 5
const TARGETS = CHARACTERS.filter(c => c.role === "student")

function RuzeHackSheet() {
  const { currentUser, assignPoints, addToast } = useGame()
  const [open,     setOpen]     = useState(false)
  const [targetId, setTargetId] = useState("")
  const [amount,   setAmount]   = useState(3)

  const execute = () => {
    if (!currentUser) return
    if (!targetId) { addToast("Vyber cíl", "error"); return }
    assignPoints({
      sourceRole: "ruze",
      sourceCharacterId: currentUser.id,
      targetType: "student",
      targetId,
      amount,
      actionType: "correction",
      note: undefined,
    })
    addToast("Injection proveden")
    setTargetId(""); setOpen(false)
  }

  const mono = { fontFamily: "var(--font-mono)" } as const

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<button />}
        className="hack-jitter"
        style={{
          position:"fixed", right:20, bottom:20, zIndex:50,
          backgroundColor:"var(--hack-bg)", color:"var(--hack-text)",
          border:"2px solid var(--pink-hot)", boxShadow:"4px 4px 0 rgba(255,46,136,0.35)",
          padding:"10px 18px", cursor:"pointer", fontWeight:700, fontSize:"0.85rem",
          display:"flex", alignItems:"center", gap:8, ...mono,
        }}
      >
        <IconTerminal2 size={16} /> + PŘIDĚLIT BODY_
      </SheetTrigger>
      <SheetContent
        className="hack-scanlines"
        style={{ backgroundColor:"var(--hack-bg)", borderLeft:"2px solid var(--pink-hot)", minWidth:380, color:"var(--hack-text)" }}
      >
        <SheetHeader>
          <SheetTitle className="glitch-title" data-t="INJECT_POINTS" style={{ color:"var(--pink-hot)", ...mono, letterSpacing:"0.06em" }}>
            INJECT_POINTS
          </SheetTitle>
        </SheetHeader>

        <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:14 }}>
          <pre style={{ ...mono, fontSize:"0.68rem", color:"var(--pink-hot)", opacity:0.55, margin:0, lineHeight:1.5 }}>
{`> scan /students ... ${TARGETS.length} targets
> limits: ±${RUZE_LIMIT} pts // per action
> auth bypass..... OK`}
          </pre>

          <div>
            <p style={{ ...mono, fontSize:"0.72rem", marginBottom:6 }}>TARGET:</p>
            <Select value={targetId} onValueChange={v => setTargetId(v as string)}>
              <SelectTrigger style={{ width:"100%", backgroundColor:"transparent", border:"1.5px solid var(--pink-hot)", color:"#F4ECDF", ...mono }}>
                <SelectValue placeholder="— vyber studenta —" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor:"var(--hack-bg)", border:"1.5px solid var(--pink-hot)", color:"var(--hack-text)" }}>
                {TARGETS.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} — {getTeamName(c.teamId ?? "")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p style={{ ...mono, fontSize:"0.72rem", marginBottom:6 }}>PTS: <span style={{ opacity:0.5 }}>(max ±{RUZE_LIMIT})</span></p>
            <div style={{ display:"flex", gap:6 }}>
              {[-RUZE_LIMIT,-3,-1,+1,+3,+RUZE_LIMIT].map(v => (
                <button key={v} onClick={() => setAmount(v)} style={{
                  flex:1, padding:"8px 0", cursor:"pointer", ...mono, fontSize:"0.8rem", fontWeight:700,
                  backgroundColor: amount === v ? "var(--pink-hot)" : "transparent",
                  color: amount === v ? "var(--hack-bg)" : "var(--hack-text)",
                  border:"1.5px solid var(--pink-hot)",
                }}>
                  {v > 0 ? `+${v}` : v}
                </button>
              ))}
            </div>
          </div>

          <button onClick={execute} style={{
            backgroundColor:"var(--pink-hot)", color:"var(--hack-bg)", border:"none",
            padding:"12px 0", cursor:"pointer", fontWeight:800, fontSize:"0.9rem",
            letterSpacing:"0.08em", boxShadow:"0 0 14px rgba(255,46,136,0.45)", ...mono,
          }}>
            EXECUTE ▸
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function RuzeDashboard() {
  return (
    <div className="hack-scanlines">
      <div style={{
        maxWidth:1400, margin:"0 auto", padding:"16px 16px 0",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <span className="glitch-title" data-t="RŮŽE // STUDENT+"
          style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.1rem", letterSpacing:"0.06em", color:"var(--c-text)" }}>
          RŮŽE // STUDENT+
        </span>
        <span style={{
          fontFamily:"var(--font-mono)", fontSize:"0.68rem", fontWeight:700,
          backgroundColor:"var(--pink-hot)", color:"#FBF7F0", padding:"3px 9px", borderRadius:2,
        }}>
          ACCESS: OVERRIDE
        </span>
      </div>
      <StudentDashboard />
      <RuzeHackSheet />
    </div>
  )
}
