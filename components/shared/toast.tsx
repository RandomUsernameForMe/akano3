"use client"

import React from "react"
import { useGame } from "@/lib/game-context"

export function ToastContainer() {
  const { toasts } = useGame()
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast-slide" style={{
          backgroundColor: t.type === "error" ? "var(--destructive)" : t.type === "info" ? "var(--c-teal)" : "var(--c-success)",
          color:"#F4ECDF", padding:"10px 16px", borderRadius:8,
          boxShadow:"0 4px 16px rgba(0,0,0,0.4)", fontSize:"0.875rem",
          fontWeight:500, maxWidth:320,
        }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
