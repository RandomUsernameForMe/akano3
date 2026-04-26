"use client"

import React from "react"
import { useGame } from "@/lib/game-context"

export function ToastContainer() {
  const { toasts } = useGame()
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast-slide" style={{
          backgroundColor: t.type === "error" ? "#c0392b" : t.type === "info" ? "#2a6a8a" : "#2a8a5a",
          color:"#fff", padding:"10px 16px", borderRadius:8,
          boxShadow:"0 4px 16px rgba(0,0,0,0.4)", fontSize:"0.875rem",
          fontWeight:500, maxWidth:320,
        }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
