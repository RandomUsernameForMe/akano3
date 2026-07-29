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
        <IconTerminal2 size={16} /> UPRAVIT BODY_
      </SheetTrigger>
      <SheetContent
        className="hack-scanlines"
        showCloseButton={false}
        style={{ backgroundColor:"var(--hack-bg)", borderLeft:"2px solid var(--pink-hot)", minWidth:380, color:"var(--hack-text)" }}
      >
        <SheetHeader>
          <SheetTitle className="glitch-title" data-t="INJECT_POINTS" style={{ color:"var(--pink-hot)", ...mono, letterSpacing:"0.06em" }}>
            INJECT_POINTS
          </SheetTitle>
        </SheetHeader>

        <div style={{ padding:"0 16px 16px", display:"flex", flexDirection:"column", gap:14 }}>
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

const FAKE_CODE = `> ssh root@akano.school ......... OK
> priv_esc --exploit CVE-∞ ....... OK
while(true){ pts = steal(sys)
  if(caught) never(); }
0xFF2E88 >> /dev/school
inject --target STU_* --pts ±5
auth bypass ..................... OK
grant ruze WRITE ................ OK
rm -rf /oxblood && paint --pink
`

export function RuzeDashboard({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  const codeText = Array.from({ length: 8 }, () => FAKE_CODE).join("\n")

  if (hidden) {
    // panic mode — plain student profile, only an unremarkable chip leads back
    return (
      <div>
        <div style={{
          maxWidth:1400, margin:"0 auto", padding:"16px 16px 0",
          display:"flex", justifyContent:"flex-end",
        }}>
          <button onClick={onToggle} style={{
            fontFamily:"var(--font-mono)", fontSize:"0.68rem", fontWeight:600,
            backgroundColor:"var(--c-bg-section)", color:"var(--c-text-faint)",
            border:"1px solid var(--c-border)", padding:"3px 9px", borderRadius:2, cursor:"pointer",
          }}>
            ACCESS: STANDARD
          </button>
        </div>
        <StudentDashboard />
      </div>
    )
  }

  return (
    <div className="hack-scanlines" style={{ position:"relative" }}>
      {/* rose watermark bleeding through the whole page — vandalized system */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:"url(/ruze-rose.png)", backgroundRepeat:"no-repeat",
        backgroundPosition:"center 30%", backgroundSize:"min(80vw, 700px)",
        opacity:0.07, transform:"rotate(8deg)",
      }} />
      {/* code leaking down both edges */}
      <div className="code-rain" style={{ left:4 }}><pre>{codeText}</pre></div>
      <div className="code-rain" style={{ right:4, textAlign:"right" }}><pre style={{ animationDelay:"-9s" }}>{codeText}</pre></div>
      {/* slice glitch sweeping the whole screen */}
      <div className="ruze-slices" />
      <div className="torn-strip" />
      <div className="ruze-skew ruze-pinkwash" style={{ position:"relative", zIndex:1 }}>
        <div style={{
          maxWidth:1400, margin:"0 auto", padding:"16px 16px 0",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <span className="glitch-title" data-t="RŮŽE // STUDENT+"
            style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.1rem", letterSpacing:"0.06em", color:"var(--pink-hot)" }}>
            RŮŽE // STUDENT+
          </span>
          <button onClick={onToggle} style={{
            fontFamily:"var(--font-mono)", fontSize:"0.68rem", fontWeight:700,
            backgroundColor:"var(--pink-hot)", color:"#12040C", padding:"3px 9px", borderRadius:2,
            border:"none", cursor:"pointer",
          }}>
            ACCESS: OVERRIDE
          </button>
        </div>
        <StudentDashboard />
      </div>
      {/* outside .ruze-skew — its transform would turn position:fixed into
          scroll-following (transform creates a containing block) */}
      <RuzeHackSheet />
    </div>
  )
}
