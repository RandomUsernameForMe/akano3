"use client"

import React, { useState, useCallback, useEffect, createContext, useContext, useRef, useMemo } from "react"
import type { Team, Character, PointEntry, AlarmState, QRCode, Toast, RunSummary } from "./types"
import { TEAMS, CHARACTERS, UNITS, CIRCLES } from "./data"
import { ALARM_COLORS } from "./constants"
import { getTeamName, romanNumeral } from "./utils"

export interface GameCtx {
  teams:              Team[]
  characters:         Character[]
  pointLog:           PointEntry[]
  alarmState:         AlarmState
  broadcastActive:    boolean
  lessonWindowActive: boolean
  lessonWindowEnd:    Date | null
  qrCodes:            QRCode[]
  toasts:             Toast[]
  currentUser:        Character | null
  setCurrentUser: (char: Character | null) => void
  login:         (code: string) => Character | null
  logout:        () => void
  assignPoints:  (entry: Omit<PointEntry, "id" | "timestamp" | "resolvedTeamIds">) => void
  updateKaichi:  (characterId: string) => void
  triggerAlarm:  (type: AlarmState["type"], message: string) => void
  dismissAlarm:  () => void
  setBroadcast:  (active: boolean) => void
  generateQR:    (cfg: Omit<QRCode, "id" | "token" | "timesScanned" | "status" | "createdAt">) => void
  toggleLesson:  (active: boolean, durationMin?: number) => void
  giftPoints:    (fromId: string, toId: string, amount: number) => void
  claimLesson:   (studentId: string) => void
  addToast:      (msg: string, type?: Toast["type"]) => void
  activeRunId:   number | null
  runs:          RunSummary[]
  setActiveRun:  (runId: number) => Promise<void>
  createRun:     (name: string) => Promise<void>
}

export const GameContext = createContext<GameCtx | null>(null)

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be inside GameProvider")
  return ctx
}

// Merge static CHARACTERS with mutable DB state
function buildCharacters(
  charState: { character_id: string; kaichi_level: number; peer_point_pool: number; lesson_claimed_this_window: boolean; specialization: string | null }[],
  circleMembers: { circle_id: string; character_id: string }[],
  teamUnits: { team_id: string; unit_id: string }[]
): Character[] {
  const circlesByChar: Record<string, string[]> = {}
  for (const { circle_id, character_id } of circleMembers) {
    if (!circlesByChar[character_id]) circlesByChar[character_id] = []
    circlesByChar[character_id].push(circle_id)
  }
  const unitByTeam: Record<string, string> = {}
  for (const { team_id, unit_id } of teamUnits) unitByTeam[team_id] = unit_id

  return CHARACTERS.map(c => {
    const state = charState.find(s => s.character_id === c.id)
    return {
      ...c,
      kaichiLevel: state?.kaichi_level ?? c.kaichiLevel,
      peerPointPool: state?.peer_point_pool ?? c.peerPointPool,
      lessonClaimedThisWindow: state?.lesson_claimed_this_window ?? false,
      specialization: (state?.specialization as Character["specialization"]) ?? c.specialization,
      circleIds: circlesByChar[c.id] ?? c.circleIds,
      unitId: c.teamId ? (unitByTeam[c.teamId] ?? c.unitId) : c.unitId,
    }
  })
}

// Merge static TEAMS with DB points and unit assignments
function buildTeams(
  teamPoints: { team_id: string; points: number }[],
  teamUnits: { team_id: string; unit_id: string }[]
): Team[] {
  const pointsMap: Record<string, number> = {}
  for (const { team_id, points } of teamPoints) pointsMap[team_id] = points
  const unitMap: Record<string, string> = {}
  for (const { team_id, unit_id } of teamUnits) unitMap[team_id] = unit_id

  return TEAMS.map(t => ({
    ...t,
    points: pointsMap[t.id] ?? t.points,
    unitId: unitMap[t.id] ?? t.unitId,
  }))
}

function parsePointLog(rows: Record<string, unknown>[]): PointEntry[] {
  return rows.map(r => ({
    id: r.id as string,
    timestamp: new Date(r.timestamp as string),
    sourceRole: r.source_role as PointEntry["sourceRole"],
    sourceCharacterId: r.source_character_id as string,
    targetType: r.target_type as PointEntry["targetType"],
    targetId: r.target_id as string,
    resolvedTeamIds: r.resolved_team_ids as string[],
    amount: r.amount as number,
    actionType: r.action_type as PointEntry["actionType"],
    note: r.note as string | undefined,
  }))
}

function parseQRCodes(rows: Record<string, unknown>[]): QRCode[] {
  return rows.map(r => ({
    id: r.id as string,
    token: r.token as string,
    label: r.label as string,
    targetType: r.target_type as QRCode["targetType"],
    targetId: r.target_id as string,
    points: r.points as number,
    validity: r.validity as QRCode["validity"],
    validUntil: r.valid_until ? new Date(r.valid_until as string) : undefined,
    timesScanned: r.times_scanned as number,
    status: r.status as QRCode["status"],
    createdAt: new Date(r.created_at as string),
  }))
}

export function GameProvider({ children, initialUserId }: { children: React.ReactNode; initialUserId?: string }) {
  const [teams,           setTeams]           = useState<Team[]>(TEAMS)
  const [characters,      setCharacters]      = useState<Character[]>(CHARACTERS)
  const [pointLog,        setPointLog]        = useState<PointEntry[]>([])
  const [alarmState,      setAlarmState]      = useState<AlarmState>({ active:false, type:"evacuation", message:"", color:"#c0392b" })
  const [broadcastActive, setBroadcastActive] = useState(false)
  const [lessonWindowActive, setLessonWindowActive] = useState(false)
  const [lessonWindowEnd, setLessonWindowEnd] = useState<Date | null>(null)
  const [qrCodes,         setQrCodes]         = useState<QRCode[]>([])
  const [toasts,          setToasts]          = useState<Toast[]>([])
  const [currentUser,     setCurrentUser]     = useState<Character | null>(() => {
    if (initialUserId) return CHARACTERS.find(c => c.id === initialUserId) ?? null
    if (typeof window === "undefined") return null
    const saved = sessionStorage.getItem("akano_user_id")
    return saved ? (CHARACTERS.find(c => c.id === saved) ?? null) : null
  })
  const [activeRunId,     setActiveRunId]     = useState<number | null>(null)
  const [runs,            setRuns]            = useState<RunSummary[]>([])

  const offlineRef  = useRef(false)
  const failCountRef = useRef(0)

  const applyGameState = useCallback((data: Record<string, unknown>) => {
    const alarm   = data.alarm as Record<string, unknown>
    const config  = data.config as Record<string, unknown>
    const tp      = data.teamPoints as { team_id: string; points: number }[]
    const cs      = data.charState as { character_id: string; kaichi_level: number; peer_point_pool: number; lesson_claimed_this_window: boolean; specialization: string | null }[]
    const cm      = data.circleMembers as { circle_id: string; character_id: string }[]
    const tu      = data.teamUnits as { team_id: string; unit_id: string }[]
    const pl      = data.pointLog as Record<string, unknown>[]
    const qr      = data.qrCodes as Record<string, unknown>[]
    const runsRaw = data.runs as { id: number; name: string; is_active: boolean; created_at: string }[]

    setActiveRunId(data.activeRunId as number ?? null)
    setRuns(runsRaw?.map(r => ({ id: r.id, name: r.name, isActive: r.is_active, createdAt: new Date(r.created_at) })) ?? [])
    setAlarmState({ active: alarm.active as boolean, type: alarm.type as AlarmState["type"], message: alarm.message as string, color: alarm.color as string })
    setLessonWindowActive(config.lesson_window_active as boolean)
    setLessonWindowEnd(config.lesson_window_end ? new Date(config.lesson_window_end as string) : null)
    const chars = buildCharacters(cs, cm, tu)
    setTeams(buildTeams(tp, tu))
    setCharacters(chars)
    setCurrentUser(prev => prev ? (chars.find(c => c.id === prev.id) ?? prev) : null)
    setPointLog(parsePointLog(pl))
    setQrCodes(parseQRCodes(qr))
  }, [])

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const fetchGameState = useCallback(async () => {
    try {
      const res = await fetch("/api/game-state")
      if (!res.ok) {
        failCountRef.current++
        if (failCountRef.current >= 3 && !offlineRef.current) {
          addToast("Ztráta spojení se serverem", "error")
          offlineRef.current = true
        }
        return
      }
      failCountRef.current = 0
      if (offlineRef.current) { addToast("Spojení obnoveno", "success"); offlineRef.current = false }
      const data = await res.json()
      applyGameState(data)
    } catch {
      failCountRef.current++
      if (failCountRef.current >= 3 && !offlineRef.current) {
        addToast("Ztráta spojení se serverem", "error")
        offlineRef.current = true
      }
    }
  }, [applyGameState, addToast])

  // SSE real-time sync — replaces polling
  // isLoggedIn (boolean) prevents the effect from re-running on every applyGameState call
  const isLoggedIn = currentUser !== null
  useEffect(() => {
    if (!isLoggedIn) return

    fetchGameState()

    const es = new EventSource("/api/events")
    let offlineTimer: ReturnType<typeof setTimeout> | null = null

    es.addEventListener("alarm", (e: MessageEvent) => {
      const d = JSON.parse(e.data) as { active: boolean; alarmType?: AlarmState["type"]; message?: string; color?: string }
      setAlarmState(prev =>
        d.active
          ? { active: true, type: d.alarmType!, message: d.message!, color: d.color! }
          : { ...prev, active: false }
      )
    })
    es.addEventListener("state-changed", () => fetchGameState())
    es.addEventListener("config-changed", () => fetchGameState())
    es.addEventListener("run-changed", () => fetchGameState())

    es.onopen = () => {
      if (offlineTimer) { clearTimeout(offlineTimer); offlineTimer = null }
      if (offlineRef.current) { addToast("Spojení obnoveno", "success"); offlineRef.current = false; fetchGameState() }
    }

    es.onerror = () => {
      if (!offlineRef.current && offlineTimer === null) {
        offlineTimer = setTimeout(() => {
          offlineTimer = null
          if (!offlineRef.current) { addToast("Ztráta spojení se serverem", "error"); offlineRef.current = true }
        }, 5000)
      }
    }

    const onVisibility = () => { if (!document.hidden) fetchGameState() }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      es.close()
      if (offlineTimer) clearTimeout(offlineTimer)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [isLoggedIn, fetchGameState, addToast])

  const login = useCallback((code: string): Character | null => {
    const char = characters.find(c => c.code === code.trim())
    if (!char) return null
    sessionStorage.setItem("akano_user_id", char.id)
    setCurrentUser(char)
    return char
  }, [characters])

  const logout = useCallback(() => {
    sessionStorage.removeItem("akano_user_id")
    setCurrentUser(null)
  }, [])

  const assignPoints = useCallback(async (entry: Omit<PointEntry, "id" | "timestamp" | "resolvedTeamIds">) => {
    try {
      const res = await fetch("/api/points", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(entry) })
      if (!res.ok) { addToast("Chyba při zadávání bodů", "error"); return }
      const { id, resolvedTeamIds } = await res.json()
      // Optimistic update
      const full: PointEntry = { ...entry, id, timestamp: new Date(), resolvedTeamIds }
      setPointLog(prev => [full, ...prev])
      setTeams(prev => prev.map(t => resolvedTeamIds.includes(t.id) ? { ...t, points: t.points + entry.amount } : t))
      addToast(`${entry.amount > 0 ? "+" : ""}${entry.amount} bodů → ${resolvedTeamIds.map(getTeamName).join(", ")}`)
    } catch { addToast("Chyba sítě", "error") }
  }, [addToast])

  const updateKaichi = useCallback(async (characterId: string) => {
    try {
      const res = await fetch("/api/kaichi", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ characterId }) })
      if (!res.ok) { addToast("Chyba při povýšení", "error"); return }
      setCharacters(prev => {
        const updated = prev.map(c => c.id === characterId && c.kaichiLevel < 8 ? { ...c, kaichiLevel: c.kaichiLevel + 1 } : c)
        const char = updated.find(c => c.id === characterId)
        addToast(`${char?.name ?? "Postava"} povýšena na Kaichi ${romanNumeral(char?.kaichiLevel ?? 0)}`)
        return updated
      })
    } catch { addToast("Chyba sítě", "error") }
  }, [addToast])

  const triggerAlarm = useCallback(async (type: AlarmState["type"], message: string) => {
    const color = ALARM_COLORS[type]
    setAlarmState({ active:true, type, message, color })
    try {
      await fetch("/api/alarm", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"trigger", type, message }) })
    } catch { /* optimistic — polling will sync */ }
  }, [])

  const dismissAlarm = useCallback(async () => {
    setAlarmState(prev => ({ ...prev, active:false }))
    try {
      await fetch("/api/alarm", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"dismiss" }) })
    } catch { /* optimistic */ }
  }, [])

  const setBroadcast = useCallback((active: boolean) => {
    setBroadcastActive(active)
  }, [])

  const generateQR = useCallback(async (cfg: Omit<QRCode, "id" | "token" | "timesScanned" | "status" | "createdAt">) => {
    try {
      const res = await fetch("/api/qr", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(cfg) })
      if (!res.ok) { addToast("Chyba při generování QR", "error"); return }
      addToast("QR kód vygenerován")
      fetchGameState()
    } catch { addToast("Chyba sítě", "error") }
  }, [addToast, fetchGameState])

  const toggleLesson = useCallback(async (active: boolean, durationMin = 30) => {
    try {
      const res = await fetch("/api/lesson", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"toggle", active, durationMin }) })
      if (!res.ok) { addToast("Chyba", "error"); return }
      setLessonWindowActive(active)
      if (active) {
        setLessonWindowEnd(new Date(Date.now() + durationMin * 60000))
        setCharacters(prev => prev.map(c => ({ ...c, lessonClaimedThisWindow: false })))
        addToast("Okno pro body za hodinu otevřeno")
      } else {
        setLessonWindowEnd(null)
        addToast("Okno pro body za hodinu zavřeno")
      }
    } catch { addToast("Chyba sítě", "error") }
  }, [addToast])

  const giftPoints = useCallback(async (fromId: string, toId: string, amount: number) => {
    try {
      const res = await fetch("/api/gift", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ fromId, toId, amount }) })
      if (!res.ok) { addToast("Chyba při daru", "error"); return }
      setCharacters(prev => prev.map(c => c.id === fromId ? { ...c, peerPointPool: c.peerPointPool - amount } : c))
    } catch { addToast("Chyba sítě", "error") }
  }, [addToast])

  const claimLesson = useCallback(async (studentId: string) => {
    if (!lessonWindowActive) return
    try {
      const res = await fetch("/api/lesson", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"claim", characterId: studentId }) })
      if (!res.ok) { addToast("Chyba", "error"); return }
      const student = characters.find(c => c.id === studentId)
      if (student?.teamId) {
        await assignPoints({ sourceRole:"student", sourceCharacterId:studentId, targetType:"team", targetId:student.teamId, amount:5, actionType:"lesson", note:"Body za hodinu" })
      }
      setCharacters(prev => prev.map(c => c.id === studentId ? { ...c, lessonClaimedThisWindow: true } : c))
      addToast("Body za hodinu přidány!")
    } catch { addToast("Chyba sítě", "error") }
  }, [lessonWindowActive, characters, assignPoints, addToast])

  const setActiveRun = useCallback(async (runId: number) => {
    try {
      const res = await fetch("/api/runs", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"setActive", runId }) })
      if (!res.ok) { addToast("Chyba při přepínání běhu", "error"); return }
      addToast("Aktivní běh přepnut")
      fetchGameState()
    } catch { addToast("Chyba sítě", "error") }
  }, [addToast, fetchGameState])

  const createRun = useCallback(async (name: string) => {
    try {
      const res = await fetch("/api/runs", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name }) })
      if (!res.ok) { addToast("Chyba při vytváření běhu", "error"); return }
      addToast(`Běh "${name}" vytvořen`)
      fetchGameState()
    } catch { addToast("Chyba sítě", "error") }
  }, [addToast, fetchGameState])

  const value = useMemo<GameCtx>(() => ({
    teams, characters, pointLog, alarmState, broadcastActive,
    lessonWindowActive, lessonWindowEnd, qrCodes, toasts, currentUser, setCurrentUser, login, logout,
    assignPoints, updateKaichi,
    triggerAlarm, dismissAlarm, setBroadcast, generateQR,
    toggleLesson, giftPoints, claimLesson, addToast,
    activeRunId, runs, setActiveRun, createRun,
  }), [teams, characters, pointLog, alarmState, broadcastActive,
    lessonWindowActive, lessonWindowEnd, qrCodes, toasts, currentUser,
    login, logout, assignPoints, updateKaichi,
    triggerAlarm, dismissAlarm, setBroadcast, generateQR,
    toggleLesson, giftPoints, claimLesson, addToast,
    activeRunId, runs, setActiveRun, createRun])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
