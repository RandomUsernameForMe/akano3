"use client"

import React, { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { GameProvider, useGame } from "@/lib/game-context"
import { GMDashboard } from "@/components/views/gm-dashboard"
import { TeacherDashboard, RuzeDashboard } from "@/components/views/teacher-dashboard"
import { StudentDashboard } from "@/components/views/student-dashboard"
import { DisplayScreen } from "@/components/views/display-screen"
import { AlarmBannerStrip } from "@/components/shared/alarm-banner"
import { ToastContainer } from "@/components/shared/toast"
import { TopBar } from "@/components/shared/top-bar"
import { ThemeProvider } from "@/lib/theme-context"
import { ErrorBoundary } from "@/components/shared/error-boundary"

function CharacterRouter() {
  const { currentUser } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (currentUser === null) router.replace("/")
  }, [currentUser, router])

  if (!currentUser) return null

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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <GameProvider initialUserId={id}>
            <CharacterRouter />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
