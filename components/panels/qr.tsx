"use client"

import React, { useState } from "react"
import { IconPlus, IconQrcode } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGame } from "@/lib/game-context"
import { TEAMS, UNITS, CIRCLES } from "@/lib/data"
import { getTargetName } from "@/lib/utils"
import type { QRCode } from "@/lib/types"

export function QRPanel() {
  const { qrCodes, generateQR } = useGame()
  const [label,      setLabel]      = useState("")
  const [targetType, setTargetType] = useState<"team" | "unit" | "circle">("team")
  const [targetId,   setTargetId]   = useState("")
  const [points,     setPoints]     = useState(15)
  const [validity,   setValidity]   = useState<"once" | "timed" | "repeat">("once")
  const [showForm,   setShowForm]   = useState(false)

  const targetOptions = targetType === "team" ? TEAMS.map(t=>({id:t.id,label:t.name}))
    : targetType === "unit" ? UNITS.map(u=>({id:u.id,label:u.name}))
    : CIRCLES.map(c=>({id:c.id,label:c.name}))

  const handleGenerate = () => {
    if (!label || !targetId) return
    generateQR({ label, targetType, targetId, points, validity })
    setLabel(""); setTargetId(""); setShowForm(false)
  }

  const statusColor = (s: QRCode["status"]) =>
    s==="active" ? "#2a8a5a" : s==="used" ? "#c8a96e80" : "#e05252"

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem" }}>{qrCodes.length} kódů celkem</p>
        <Button onClick={() => setShowForm(v => !v)} style={{ backgroundColor:"#2a8a8a", color:"#fff", fontSize:"0.8rem" }}>
          <IconPlus size={14} style={{marginRight:6}} /> Generovat QR
        </Button>
      </div>

      {showForm && (
        <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
          borderRadius:10, padding:20, marginBottom:20 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>POPIS / NÁZEV</Label>
              <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="např. Sklep — průzkum"
                style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }} />
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>TYP CÍLE</Label>
              <Select value={targetType} onValueChange={v => { setTargetType(v as "team"|"unit"|"circle"); setTargetId("") }}>
                <SelectTrigger style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Tým</SelectItem>
                  <SelectItem value="unit">Jednotka</SelectItem>
                  <SelectItem value="circle">Kruh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>CÍL</Label>
              <Select value={targetId} onValueChange={(v) => setTargetId(v ?? "")}>
                <SelectTrigger style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
                  <SelectValue placeholder="Vyber…" />
                </SelectTrigger>
                <SelectContent>
                  {targetOptions.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>BODY</Label>
              <Input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={1}
                style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }} />
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>PLATNOST</Label>
              <Select value={validity} onValueChange={v => setValidity(v as "once"|"timed"|"repeat")}>
                <SelectTrigger style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Jednorázový</SelectItem>
                  <SelectItem value="timed">Časově omezený</SelectItem>
                  <SelectItem value="repeat">Opakovaný</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <Button onClick={handleGenerate} disabled={!label || !targetId}
              style={{ backgroundColor:"#2a8a8a", color:"#fff" }}>
              <IconQrcode size={14} style={{marginRight:6}} /> Vygenerovat
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}
              style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zrušit</Button>
          </div>
        </div>
      )}

      <div style={{ overflowX:"auto" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor:"#a0263330" }}>
              {["Název","Cíl","Body","Platnost","Naskenováno","Stav","Token"].map(h => (
                <TableHead key={h} style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.75rem" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {qrCodes.map(q => (
              <TableRow key={q.id} style={{ borderColor:"rgba(107,15,26,0.08)" }}>
                <TableCell style={{ color:"#1a0a0a", fontWeight:600 }}>{q.label}</TableCell>
                <TableCell style={{ color:"#6b0f1a", fontSize:"0.82rem" }}>
                  {getTargetName(q.targetType, q.targetId)}
                </TableCell>
                <TableCell style={{ color:"#d4a017", fontFamily:"monospace", fontWeight:700 }}>+{q.points}</TableCell>
                <TableCell style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem" }}>
                  {q.validity === "once" ? "Jednorázový" : q.validity === "timed" ? "Časový" : "Opakovaný"}
                </TableCell>
                <TableCell style={{ color:"#6b0f1a", fontFamily:"monospace" }}>{q.timesScanned}×</TableCell>
                <TableCell>
                  <span style={{ color:statusColor(q.status), fontSize:"0.8rem", fontWeight:600 }}>
                    {q.status === "active" ? "Aktivní" : q.status === "used" ? "Použitý" : "Expirovaný"}
                  </span>
                </TableCell>
                <TableCell style={{ color:"rgba(107,15,26,0.3)", fontFamily:"monospace", fontSize:"0.75rem" }}>{q.token}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
