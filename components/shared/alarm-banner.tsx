"use client"

import React, { useEffect, useState } from "react"
import { IconBellRinging } from "@tabler/icons-react"
import { useGame } from "@/lib/game-context"

// ponytail: modulový AudioContext — autoplay policy pustí zvuk až po user gestu
let audioCtx: AudioContext | null = null

function startSiren(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  osc.type = "square"
  osc.frequency.value = 750
  lfo.frequency.value = 1
  lfoGain.gain.value = 150
  lfo.connect(lfoGain).connect(osc.frequency)
  gain.gain.value = 0.3
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  lfo.start()
  return () => {
    osc.stop()
    lfo.stop()
    osc.disconnect()
    lfo.disconnect()
    gain.disconnect()
    lfoGain.disconnect()
  }
}

function useAlarmSound(active: boolean) {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const unlock = () => {
      audioCtx ??= new AudioContext()
      if (audioCtx.state === "suspended") void audioCtx.resume()
      setUnlocked(true)
      window.removeEventListener("pointerdown", unlock)
    }
    window.addEventListener("pointerdown", unlock)
    return () => window.removeEventListener("pointerdown", unlock)
  }, [])

  useEffect(() => {
    if (!active || !unlocked || !audioCtx) return
    return startSiren(audioCtx)
  }, [active, unlocked])
}

export function AlarmBannerStrip() {
  const { alarmState } = useGame()
  useAlarmSound(alarmState.active)
  if (!alarmState.active) return null
  return (
    <div style={{
      backgroundColor:"#A32B22", color:"#F4ECDF",
      padding:"6px 16px", textAlign:"center",
      fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.05em",
    }}>
      <IconBellRinging size={14} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }} />
      ALARM AKTIVNÍ: {alarmState.message || alarmState.type.toUpperCase()}
    </div>
  )
}
