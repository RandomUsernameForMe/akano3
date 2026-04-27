"use client"

import React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { GameProvider, useGame } from "@/lib/game-context"
import { LoginScreen } from "@/components/views/login"
import { GMDashboard } from "@/components/views/gm-dashboard"
import { TeacherDashboard, RuzeDashboard } from "@/components/views/teacher-dashboard"
import { StudentDashboard } from "@/components/views/student-dashboard"
import { DisplayScreen } from "@/components/views/display-screen"
import { AlarmBannerStrip } from "@/components/shared/alarm-banner"
import { ToastContainer } from "@/components/shared/toast"
import { TopBar } from "@/components/shared/top-bar"
import { ThemeProvider } from "@/lib/theme-context"

function Router() {
  const { currentUser } = useGame()

  if (!currentUser) return <LoginScreen />

  const role = currentUser.role
  if (role === "display") return <DisplayScreen />

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"var(--c-bg)", color:"var(--c-text)" }}>
      <AlarmBannerStrip />
      <TopBar showBroadcast={["gm","teacher","ruze"].includes(role)} />
      {role === "student" ? (
        <>
          <StudentDashboard />
          <ToastContainer />
        </>
      ) : (
        <>
          <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px 16px" }}>
            {role === "gm"      && <GMDashboard />}
            {role === "teacher" && <TeacherDashboard />}
            {role === "ruze"    && <RuzeDashboard />}
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", backgroundColor:"#faf7f2", color:"#6b0f1a",
          gap:16, padding:32,
        }}>
          <p style={{ fontWeight:700, fontSize:"1.1rem" }}>Nastala neočekávaná chyba</p>
          <pre style={{ fontSize:"0.75rem", opacity:0.6, maxWidth:480, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            {this.state.error.message}
          </pre>
          <button onClick={() => this.setState({ error: null })} style={{
            padding:"8px 20px", backgroundColor:"#6b0f1a", color:"#fff",
            border:"none", borderRadius:6, cursor:"pointer",
          }}>
            Zkusit znovu
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function AkanoApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <GameProvider>
            <Router />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
