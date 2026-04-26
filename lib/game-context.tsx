"use client"

import React, { useState, useCallback, createContext, useContext } from "react"
import type {
  Team, Character, PointEntry, MiasmaEntry, AlarmState, QRCode, Toast,
} from "./types"
import { TEAMS, CHARACTERS, INITIAL_POINT_LOG, INITIAL_QR_CODES } from "./data"
import { ALARM_COLORS } from "./constants"
import { resolveTargetTeams, romanNumeral, getTeamName } from "./utils"

export interface GameCtx {
  // State
  teams:              Team[]
  characters:         Character[]
  pointLog:           PointEntry[]
  miasmaValue:        number
  miasmaLog:          MiasmaEntry[]
  alarmState:         AlarmState
  broadcastActive:    boolean
  lessonWindowActive: boolean
  lessonWindowEnd:    Date | null
  qrCodes:            QRCode[]
  toasts:             Toast[]
  currentUser:        Character | null
  currentScreen:      string
  // Actions
  login:         (code: string) => boolean
  logout:        () => void
  navigate:      (screen: string) => void
  assignPoints:  (entry: Omit<PointEntry, "id" | "timestamp" | "resolvedTeamIds">) => void
  updateKaichi:  (characterId: string) => void
  updateMiasma:  (amount: number, note: string) => void
  triggerAlarm:  (type: AlarmState["type"], message: string) => void
  dismissAlarm:  () => void
  setBroadcast:  (active: boolean) => void
  generateQR:    (cfg: Omit<QRCode, "id" | "token" | "timesScanned" | "status" | "createdAt">) => void
  toggleLesson:  (active: boolean, durationMin?: number) => void
  giftPoints:    (fromId: string, toId: string, amount: number) => void
  claimLesson:   (studentId: string) => void
  addToast:      (msg: string, type?: Toast["type"]) => void
}

export const GameContext = createContext<GameCtx | null>(null)

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be inside GameProvider")
  return ctx
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [teams,           setTeams]           = useState<Team[]>([...TEAMS])
  const [characters,      setCharacters]      = useState<Character[]>([...CHARACTERS])
  const [pointLog,        setPointLog]        = useState<PointEntry[]>([...INITIAL_POINT_LOG])
  const [miasmaValue,     setMiasmaValue]     = useState(47)
  const [miasmaLog,       setMiasmaLog]       = useState<MiasmaEntry[]>([])
  const [alarmState,      setAlarmState]      = useState<AlarmState>({ active:false, type:"evacuation", message:"", color:"#c0392b" })
  const [broadcastActive, setBroadcastActive] = useState(false)
  const [lessonWindowActive, setLessonWindowActive] = useState(false)
  const [lessonWindowEnd, setLessonWindowEnd] = useState<Date | null>(null)
  const [qrCodes,         setQrCodes]         = useState<QRCode[]>([...INITIAL_QR_CODES])
  const [toasts,          setToasts]          = useState<Toast[]>([])
  const [currentUser,     setCurrentUser]     = useState<Character | null>(null)
  const [currentScreen,   setCurrentScreen]   = useState("login")

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const login = useCallback((code: string) => {
    const char = CHARACTERS.find(c => c.code.toLowerCase() === code.trim().toLowerCase())
    if (!char) return false
    setCurrentUser(char)
    setCurrentScreen(char.role === "display" ? "display" : char.role)
    return true
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setCurrentScreen("login")
  }, [])

  const navigate = useCallback((screen: string) => setCurrentScreen(screen), [])

  const assignPoints = useCallback((
    entry: Omit<PointEntry, "id" | "timestamp" | "resolvedTeamIds">
  ) => {
    const resolvedTeamIds = resolveTargetTeams(entry.targetType, entry.targetId)
    const full: PointEntry = {
      ...entry,
      id: `PE${Date.now()}`,
      timestamp: new Date(),
      resolvedTeamIds,
    }
    setPointLog(prev => [full, ...prev])
    setTeams(prev => prev.map(t =>
      resolvedTeamIds.includes(t.id) ? { ...t, points: t.points + entry.amount } : t
    ))
    addToast(`+${entry.amount} bodů → ${resolvedTeamIds.map(getTeamName).join(", ")}`)
  }, [addToast])

  const updateKaichi = useCallback((characterId: string) => {
    setCharacters(prev => {
      const updated = prev.map(c =>
        c.id === characterId && c.kaichiLevel < 8
          ? { ...c, kaichiLevel: c.kaichiLevel + 1 }
          : c
      )
      const char = updated.find(c => c.id === characterId)
      addToast(`${char?.name ?? "Postava"} povýšena na Kaichi ${romanNumeral(char?.kaichiLevel ?? 0)}`)
      return updated
    })
  }, [addToast])

  const updateMiasma = useCallback((amount: number, note: string) => {
    setMiasmaValue(prev => Math.max(0, prev + amount))
    setMiasmaLog(prev => [{
      id: `MI${Date.now()}`, timestamp: new Date(),
      amount, sourceCharacterId: currentUser?.id ?? "GM1", note
    }, ...prev])
    addToast(`Miasma ${amount > 0 ? "+" : ""}${amount}`)
  }, [currentUser, addToast])

  const triggerAlarm = useCallback((type: AlarmState["type"], message: string) => {
    setAlarmState({ active:true, type, message, color: ALARM_COLORS[type] })
    // REALTIME_HOOK: broadcast alarm state to all connected display screens via WebSocket
  }, [])

  const dismissAlarm = useCallback(() => {
    setAlarmState(prev => ({ ...prev, active:false }))
  }, [])

  const setBroadcast = useCallback((active: boolean) => {
    setBroadcastActive(active)
    // REALTIME_HOOK: WebRTC signaling — start/stop broadcast stream
  }, [])

  const generateQR = useCallback((cfg: Omit<QRCode, "id" | "token" | "timesScanned" | "status" | "createdAt">) => {
    const qr: QRCode = {
      ...cfg,
      id:           `QR${Date.now()}`,
      token:        `akn-${Array.from(crypto.getRandomValues(new Uint8Array(5))).map(b => b.toString(36).padStart(2,"0")).join("").slice(0,9)}`,
      timesScanned: 0,
      status:       "active",
      createdAt:    new Date(),
    }
    setQrCodes(prev => [qr, ...prev])
    addToast("QR kód vygenerován")
  }, [addToast])

  const toggleLesson = useCallback((active: boolean, durationMin = 30) => {
    setLessonWindowActive(active)
    if (active) {
      setLessonWindowEnd(new Date(Date.now() + durationMin * 60000))
      setCharacters(prev => prev.map(c => ({ ...c, lessonClaimedThisWindow: false })))
      addToast("Okno pro body za hodinu otevřeno")
    } else {
      setLessonWindowEnd(null)
      addToast("Okno pro body za hodinu zavřeno")
    }
  }, [addToast])

  const giftPoints = useCallback((fromId: string, toId: string, amount: number) => {
    const from = characters.find(c => c.id === fromId)
    const to   = characters.find(c => c.id === toId)
    setCharacters(prev => prev.map(c =>
      c.id === fromId ? { ...c, peerPointPool: c.peerPointPool - amount } : c
    ))
    if (to?.teamId) {
      assignPoints({
        sourceRole: "student", sourceCharacterId: fromId,
        targetType: "team", targetId: to.teamId,
        amount, actionType: "peer_gift",
        note: `Dar od ${from?.name ?? fromId} pro ${to?.name ?? toId}`,
      })
    }
  }, [characters, assignPoints])

  const claimLesson = useCallback((studentId: string) => {
    if (!lessonWindowActive) return
    const student = characters.find(c => c.id === studentId)
    setCharacters(prev => prev.map(c =>
      c.id === studentId ? { ...c, lessonClaimedThisWindow: true } : c
    ))
    if (student?.teamId) {
      assignPoints({
        sourceRole: "student", sourceCharacterId: studentId,
        targetType: "team", targetId: student.teamId,
        amount: 5, actionType: "lesson",
        note: "Body za hodinu",
      })
    }
    addToast("Body za hodinu přidány!")
  }, [lessonWindowActive, characters, assignPoints, addToast])

  const value: GameCtx = {
    teams, characters, pointLog, miasmaValue, miasmaLog,
    alarmState, broadcastActive, lessonWindowActive, lessonWindowEnd,
    qrCodes, toasts, currentUser, currentScreen,
    login, logout, navigate, assignPoints, updateKaichi,
    updateMiasma, triggerAlarm, dismissAlarm,
    setBroadcast, generateQR, toggleLesson, giftPoints, claimLesson, addToast,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
