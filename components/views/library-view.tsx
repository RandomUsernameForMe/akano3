"use client"

import React, { useEffect, useState } from "react"
import { IconBooks, IconLogout } from "@tabler/icons-react"
import { WikiPanel } from "@/components/panels/wiki"
import { useGame } from "@/lib/game-context"
import { romanNumeral } from "@/lib/utils"

const KAICHI_OPTIONS = [0,1,2,3,4,5,6,7,8]

export function LibraryView() {
  const { logout } = useGame()
  const [kaichi, setKaichi] = useState(0)

  // volba stupně přežije refresh, nový login začíná na nule
  useEffect(() => {
    const saved = Number(sessionStorage.getItem("library-kaichi"))
    if (saved >= 0 && saved <= 8) setKaichi(saved)
  }, [])
  function changeKaichi(k: number) {
    sessionStorage.setItem("library-kaichi", String(k))
    setKaichi(k)
  }

  return (
    <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <IconBooks size={26} color="var(--c-text)" strokeWidth={1.6} />
        <h1 style={{ fontSize:"1.3rem", fontWeight:700, color:"var(--c-text)", margin:0 }}>Knihovna</h1>
        <div style={{ flex:1 }} />
        <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.75rem", letterSpacing:"0.08em", color:"var(--c-text-muted)" }}>
          KAICHI
          <select
            value={kaichi}
            onChange={e => changeKaichi(Number(e.target.value))}
            style={{
              backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
              color:"var(--c-text)", borderRadius:6, padding:"6px 10px",
              fontSize:"0.85rem", fontFamily:"monospace", fontWeight:700,
              boxShadow:"var(--shadow-print-sm)", cursor:"pointer",
            }}
          >
            {KAICHI_OPTIONS.map(k => (
              <option key={k} value={k}>{k === 0 ? "0" : romanNumeral(k)}</option>
            ))}
          </select>
        </label>
        <button onClick={logout} style={{
          all:"unset", boxSizing:"border-box", display:"flex", alignItems:"center", gap:6,
          padding:"8px 14px", cursor:"pointer", borderRadius:6,
          border:"2px solid var(--c-border-mid)", backgroundColor:"var(--c-bg-card)",
          fontWeight:700, fontSize:"0.85rem", color:"var(--c-text)",
          boxShadow:"var(--shadow-print-sm)",
        }}>
          <IconLogout size={16} /> Odejít
        </button>
      </div>

      <WikiPanel characterId="LIB1" kaichiLevel={kaichi} kaichiOverride={kaichi} />
    </div>
  )
}
