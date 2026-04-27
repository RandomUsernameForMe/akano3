"use client"

import React, { useState } from "react"
import Image from "next/image"
import { IconUser, IconCircleX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useGame } from "@/lib/game-context"

export function LoginScreen() {
  const { login } = useGame()
  const [code,    setCode]    = useState("")
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setTimeout(() => {
      const ok = login(code)
      if (!ok) {
        setError("Neplatný kód. Zkontroluj zápis a zkus znovu.")
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"radial-gradient(ellipse at 50% 0%, #e8f4f4 0%, #f5f5f5 60%)",
      padding:24,
    }}>
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {[10,25,75,90].map(pct => (
          <div key={pct} style={{
            position:"absolute", top:0, bottom:0, left:`${pct}%`,
            width:1, background:"linear-gradient(to bottom, transparent, rgba(107,15,26,0.08), transparent)",
          }} />
        ))}
      </div>

      <div style={{ width:"100%", maxWidth:420, position:"relative" }}>
        <Image
          src="/logo.png" alt=""
          width={520} height={640}
          style={{
            objectFit:"contain", position:"absolute",
            top:"50%", left:"50%", transform:"translate(-50%, -50%)",
            opacity:0.2, pointerEvents:"none", userSelect:"none",
            width:520, height:"auto", zIndex:0,
          }}
        />

        <div style={{
          backgroundColor:"rgba(255,255,255,0.55)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(107,15,26,0.15)", borderRadius:12,
          padding:32, boxShadow:"0 4px 32px rgba(107,15,26,0.08)", position:"relative", zIndex:1,
        }}>
          <h2 style={{ color:"#1a0a0a", fontSize:"1rem", fontWeight:600, marginBottom:6, textAlign:"center" }}>
            Přihlášení
          </h2>
          <p style={{ color:"rgba(107,15,26,0.5)", fontSize:"0.8rem", textAlign:"center", marginBottom:24 }}>
            Zadej svůj kód postavy
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <Label htmlFor="code" style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.05em", fontWeight:600 }}>
                KÓD POSTAVY
              </Label>
              <Input
                id="code"
                value={code}
                onChange={e => { setCode(e.target.value); setError("") }}
                placeholder="např. GM-001, STU-007, SCREEN-A"
                autoFocus
                autoComplete="off"
                style={{
                  marginTop:6,
                  backgroundColor:"#fff",
                  border:"1px solid rgba(107,15,26,0.25)",
                  color:"#1a0a0a",
                  letterSpacing:"0.1em",
                  fontFamily:"'Courier New', monospace",
                  fontSize:"1rem",
                }}
              />
            </div>

            {error && (
              <Alert style={{ backgroundColor:"#fef2f2", border:"1px solid rgba(192,57,43,0.3)", marginBottom:16 }}>
                <AlertDescription style={{ color:"#c0392b", fontSize:"0.85rem" }}>
                  <IconCircleX size={14} style={{ display:"inline", marginRight:6 }} />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading || !code.trim()}
              style={{ width:"100%", backgroundColor:"#6b0f1a", color:"#fff", fontWeight:700, letterSpacing:"0.05em" }}
            >
              {loading ? "Ověřuji…" : "Vstoupit"}
            </Button>
          </form>

          <Separator style={{ margin:"20px 0" }} />

          <p style={{ color:"rgba(107,15,26,0.4)", fontSize:"0.72rem", textAlign:"center" }}>
            <IconUser size={11} style={{ display:"inline", marginRight:4 }} />
            Kód ti dá organizátor
          </p>

          <div style={{ marginTop:16, padding:12, backgroundColor:"rgba(107,15,26,0.04)", borderRadius:8, border:"1px solid rgba(107,15,26,0.1)" }}>
            <p style={{ color:"rgba(107,15,26,0.4)", fontSize:"0.68rem", letterSpacing:"0.05em", marginBottom:8 }}>
              DEMO KÓDY
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {[
                ["GM-001","GM"], ["TCH-001","Učitel"], ["STU-007","Student"],
                ["SCREEN-A","Display"], ["RUZE-001","Růže"],
              ].map(([c, label]) => (
                <button key={c} onClick={() => setCode(c)} style={{
                  backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)",
                  color:"#6b0f1a", padding:"2px 8px", borderRadius:4,
                  fontSize:"0.7rem", cursor:"pointer", fontFamily:"monospace",
                }}>
                  {c} <span style={{ opacity:.6 }}>({label})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
