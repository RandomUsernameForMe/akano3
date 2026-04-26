"use client"

import React, { useState, useEffect } from "react"
import { IconClock } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useGame } from "@/lib/game-context"
import { UNITS, CIRCLES } from "@/lib/data"
import { getTeamName } from "@/lib/utils"

export function GameSetupPanel() {
  const { lessonWindowActive, lessonWindowEnd, toggleLesson } = useGame()
  const [duration, setDuration] = useState(30)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    if (!lessonWindowEnd) { setTimeLeft(""); return }
    const interval = setInterval(() => {
      const diff = lessonWindowEnd.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft("Vypršelo"); clearInterval(interval); toggleLesson(false); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${m}:${String(s).padStart(2,"0")}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [lessonWindowEnd, toggleLesson])

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
      borderRadius:10, padding:20, marginBottom:16 }}>
      <p style={{ color:"#6b0f1a", fontSize:"0.75rem", letterSpacing:"0.1em", marginBottom:14 }}>{title}</p>
      {children}
    </div>
  )

  return (
    <div style={{ maxWidth:600 }}>
      {section("OKNO PRO BODY ZA HODINU",
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <Switch checked={lessonWindowActive} onCheckedChange={v => toggleLesson(v, duration)} />
            <span style={{ color:"#1a0a0a", fontSize:"0.9rem" }}>
              {lessonWindowActive ? "Okno je AKTIVNÍ" : "Okno je zavřeno"}
            </span>
            {lessonWindowActive && timeLeft && (
              <span style={{ backgroundColor:"#2a8a8a22", color:"#2a8a8a", border:"1px solid #2a8a8a60",
                padding:"2px 10px", borderRadius:20, fontFamily:"monospace", fontSize:"0.85rem", fontWeight:700 }}>
                <IconClock size={12} style={{display:"inline",marginRight:4}} />{timeLeft}
              </span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Label style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem", minWidth:80 }}>Délka (min)</Label>
            <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))}
              min={5} max={120} style={{ width:80, backgroundColor:"#fff",
                border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a" }} />
          </div>
        </div>
      )}

      {section("SESTAVENÍ HRY",
        <div style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.85rem", lineHeight:1.6 }}>
          <p>• Jednotky: {UNITS.map(u => `${u.name} (${u.teamIds.map(getTeamName).join(" + ")})`).join(", ")}</p>
          <p style={{marginTop:8}}>• Kruhy: {CIRCLES.map(c => c.name).join(", ")}</p>
          <p style={{marginTop:8, color:"rgba(107,15,26,0.3)", fontSize:"0.75rem"}}>
            Přiřazení jednotek a kruhů lze editovat v plné verzi.
          </p>
        </div>
      )}

      {section("POOL BODŮ PRO STUDENTY",
        <div style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.85rem" }}>
          <p>Výchozí pool: <strong style={{color:"#1a0a0a"}}>20 bodů</strong> na hráče</p>
          <p style={{marginTop:6, color:"rgba(107,15,26,0.3)", fontSize:"0.75rem"}}>Ruční doplnění poolu — k dispozici v plné verzi.</p>
        </div>
      )}
    </div>
  )
}
