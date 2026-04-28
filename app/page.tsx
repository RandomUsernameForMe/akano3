"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { GameProvider, useGame } from "@/lib/game-context"
import { LoginScreen } from "@/components/views/login"
import { ThemeProvider } from "@/lib/theme-context"
import { ErrorBoundary } from "@/components/shared/error-boundary"

function Router() {
  const { currentUser } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) router.replace(`/character/${currentUser.id}`)
  }, [currentUser, router])

  if (currentUser) return null
  return <LoginScreen />
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
