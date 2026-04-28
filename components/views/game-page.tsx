"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CHARACTERS } from "@/lib/data"
import { useGame } from "@/lib/game-context"
import { AlarmBannerStrip } from "@/components/shared/alarm-banner"
import { TopBar } from "@/components/shared/top-bar"
import { ToastContainer } from "@/components/shared/toast"
import { GMDashboard } from "./gm-dashboard"
import { TeacherDashboard, RuzeDashboard } from "./teacher-dashboard"
import { StudentDashboard } from "./student-dashboard"
import { DisplayScreen } from "./display-screen"

export function GamePage({ id }: { id: string }) {
  const router = useRouter()
  const { setCurrentUser } = useGame()

  const char = CHARACTERS.find(c => c.id === id)

  useEffect(() => {
    if (!char) { router.replace("/"); return }
    setCurrentUser(char)
    return () => setCurrentUser(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!char) return null
  if (char.role === "display") return <DisplayScreen />

  return (
    <div style={{
      minHeight:"100vh", color:"#1a0a0a", position:"relative", overflow:"hidden",
      background:"radial-gradient(ellipse at 65% -5%, #deeee8 0%, #faf7f2 52%)",
    }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }}>
        {[8, 22, 78, 92].map(pct => (
          <div key={pct} style={{
            position:"absolute", top:0, bottom:0, left:`${pct}%`,
            width:1, background:"linear-gradient(to bottom, transparent, rgba(107,15,26,0.06), transparent)",
          }} />
        ))}
      </div>
      <div style={{ position:"relative", zIndex:1 }}>
      <AlarmBannerStrip />
      <TopBar showBroadcast={["gm","teacher","ruze"].includes(char.role)} />
      {char.role === "student" ? (
        <>
          <StudentDashboard />
          <ToastContainer />
        </>
      ) : (
        <>
          <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px 16px" }}>
            {char.role === "gm"      && <GMDashboard />}
            {char.role === "teacher" && <TeacherDashboard />}
            {char.role === "ruze"    && <RuzeDashboard />}
          </div>
          <ToastContainer />
        </>
      )}
      </div>
    </div>
  )
}
