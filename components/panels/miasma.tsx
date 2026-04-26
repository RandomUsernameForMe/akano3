"use client"

import React, { useState } from "react"
import { IconPlus, IconMinus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useGame } from "@/lib/game-context"
import { formatDateTime } from "@/lib/utils"

export function MiasmaPanel({ canEdit = false }: { canEdit?: boolean }) {
  const { miasmaValue, miasmaLog, updateMiasma } = useGame()
  const [amount, setAmount] = useState(5)
  const [note,   setNote]   = useState("")

  const pct   = Math.min(100, (miasmaValue / 100) * 100)
  const color = miasmaValue > 70 ? "#c0392b" : miasmaValue > 40 ? "#d4813a" : "#2a8a5a"

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:24 }}>
      <div>
        <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
          borderRadius:10, padding:24, textAlign:"center" }}>
          <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.72rem", letterSpacing:"0.1em", marginBottom:8 }}>MIASMA</p>
          <div style={{ fontSize:"4rem", fontWeight:900, fontFamily:"monospace", color, lineHeight:1, marginBottom:12 }}>
            {miasmaValue}
          </div>
          <Progress value={pct} style={{ height:8, backgroundColor:"rgba(107,15,26,0.1)" }} />
          <p style={{ color:"rgba(107,15,26,0.35)", fontSize:"0.72rem", marginTop:6 }}>{pct.toFixed(0)}% maxima</p>

          {canEdit && (
            <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <button onClick={() => setAmount(a => Math.max(1, a-1))}
                  style={{ background:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a",
                    width:32, height:32, borderRadius:6, cursor:"pointer", fontSize:"1rem" }}>−</button>
                <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                  min={1} style={{ textAlign:"center", backgroundColor:"#fff",
                    border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a", height:32 }} />
                <button onClick={() => setAmount(a => a+1)}
                  style={{ background:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a",
                    width:32, height:32, borderRadius:6, cursor:"pointer", fontSize:"1rem" }}>+</button>
              </div>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Důvod…"
                style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", height:32 }} />
              <div style={{ display:"flex", gap:8 }}>
                <Button onClick={() => { updateMiasma(amount, note); setNote("") }}
                  style={{ flex:1, backgroundColor:"#c0392b22", color:"#e05252",
                    border:"1px solid #c0392b60", fontSize:"0.8rem" }}>
                  <IconPlus size={13} style={{marginRight:4}} />+{amount}
                </Button>
                <Button onClick={() => { updateMiasma(-amount, note); setNote("") }}
                  style={{ flex:1, backgroundColor:"#2a8a5a22", color:"#2a8a5a",
                    border:"1px solid #2a8a5a60", fontSize:"0.8rem" }}>
                  <IconMinus size={13} style={{marginRight:4}} />−{amount}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.72rem", letterSpacing:"0.1em", marginBottom:10 }}>LOG MIASMY</p>
        <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:320, overflowY:"auto" }}>
          {miasmaLog.length === 0 && (
            <p style={{ color:"rgba(107,15,26,0.25)", fontSize:"0.85rem", textAlign:"center", padding:24 }}>Zatím žádné záznamy</p>
          )}
          {miasmaLog.map(m => (
            <div key={m.id} style={{ display:"flex", gap:12, alignItems:"center",
              backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.08)",
              borderRadius:6, padding:"8px 12px" }}>
              <span style={{ fontFamily:"monospace", fontSize:"0.75rem", color:"rgba(107,15,26,0.45)", whiteSpace:"nowrap" }}>
                {formatDateTime(m.timestamp)}
              </span>
              <span style={{ fontWeight:700, fontFamily:"monospace", color: m.amount > 0 ? "#e05252" : "#2a8a5a" }}>
                {m.amount > 0 ? "+" : ""}{m.amount}
              </span>
              <span style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.82rem", flex:1 }}>{m.note || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
