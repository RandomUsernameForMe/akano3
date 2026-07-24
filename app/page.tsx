"use client"

import React, { useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { GameProvider, useGame } from "@/lib/game-context"
import { LoginScreen } from "@/components/views/login"
import { ThemeProvider } from "@/lib/theme-context"
import { ErrorBoundary } from "@/components/shared/error-boundary"

function Router() {
  const { logout } = useGame()

  useEffect(() => {
    logout()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
