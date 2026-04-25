"use client"

// ═══════════════════════════════════════════════════════════════════════════════
// AKANO3 — Single-file Next.js Prototype
// Phase 1: Foundation — types, mock data, context, login, app shell
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  useState, useEffect, useCallback, createContext,
  useContext, useRef, useMemo
} from "react"

// ─── shadcn/ui ────────────────────────────────────────────────────────────────
import { Button }                                   from "@/components/ui/button"
import { Input }                                    from "@/components/ui/input"
import { Textarea }                                 from "@/components/ui/textarea"
import { Label }                                    from "@/components/ui/label"
import { Badge }                                    from "@/components/ui/badge"
import { Progress }                                 from "@/components/ui/progress"
import { Separator }                                from "@/components/ui/separator"
import { Switch }                                   from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription }                  from "@/components/ui/alert"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
}                                                   from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem }               from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ─── Tabler Icons ─────────────────────────────────────────────────────────────
import {
  IconSword, IconUser, IconUsers, IconChartLine, IconList, IconSettings,
  IconAlertTriangle, IconMicrophone, IconMicrophoneOff, IconQrcode,
  IconLogout, IconPlus, IconMinus, IconCheck, IconBell, IconBellRinging,
  IconDashboard, IconTrophy, IconTarget, IconActivity, IconClock,
  IconDownload, IconSearch, IconChevronUp, IconChevronDown,
  IconEye, IconSwords, IconSchool, IconCrown, IconDeviceDesktop,
  IconCircleCheck, IconCircleX, IconNote, IconRefresh, IconVolume,
  IconFilter, IconFlame, IconShield, IconStar, IconX, IconMenu2,
  IconPrinter, IconHash, IconGitBranch, IconPlayerPlay, IconPlayerStop,
  IconBook, IconCalendar, IconDna, IconMap, IconRun, IconPencil,
  IconTrash, IconWifi, IconChevronRight, IconArrowLeft,
  IconBrandTabler, IconAlarm,
  IconCat, IconBrush, IconPaw, IconCpu, IconRosette, IconMask, IconUsersGroup,
} from "@tabler/icons-react"

// ─── Recharts ─────────────────────────────────────────────────────────────────
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from "recharts"


// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES — injects font + CSS variable overrides
// ═══════════════════════════════════════════════════════════════════════════════

function GlobalStyles() {
  useEffect(() => {
    // Cinzel font for headings
    const font = document.createElement("link")
    font.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap"
    font.rel  = "stylesheet"
    document.head.appendChild(font)

    // Custom CSS variables + keyframes
    const style = document.createElement("style")
    style.innerHTML = `
      .font-cinzel        { font-family: 'Cinzel', serif; }
      .sand-card          { background:#c8a96e !important; color:#3a1a0a !important; }
      .sand-card *        { color:#3a1a0a !important; border-color:#b8965a !important; }
      .teal-btn           { background:#2a8a8a !important; color:#fff !important; }
      .teal-btn:hover     { background:#3aabab !important; }

      @keyframes alarm-pulse {
        0%,100% { opacity:1; background-color:#c0392b; }
        50%     { opacity:.85; background-color:#e74c3c; }
      }
      @keyframes alarm-flash {
        0%,100% { opacity:1; }
        50%     { opacity:0; }
      }
      .alarm-overlay      { animation: alarm-pulse 1.2s ease-in-out infinite; }
      .alarm-flash-text   { animation: alarm-flash 0.8s step-end infinite; }

      @keyframes slide-in-right {
        from { transform:translateX(100%); opacity:0; }
        to   { transform:translateX(0);   opacity:1; }
      }
      .toast-slide { animation: slide-in-right 0.3s ease-out; }

      @keyframes rank-update {
        0%   { background: rgba(42,138,138,0.15); }
        100% { background: transparent; }
      }
      .rank-flash { animation: rank-update 1s ease-out; }

      /* scrollbar */
      ::-webkit-scrollbar       { width:6px; height:6px; }
      ::-webkit-scrollbar-track { background:rgba(0,0,0,.04); }
      ::-webkit-scrollbar-thumb { background:rgba(107,15,26,.2); border-radius:3px; }
    `
    document.head.appendChild(style)

    return () => {
      font.remove()
      style.remove()
    }
  }, [])
  return null
}


// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type Role = "gm" | "teacher" | "ruze" | "student" | "display"
type Specialization = "combat" | "tactical" | "support"
type ActionType =
  | "mission_success" | "mission_fail" | "lesson" | "shidosei"
  | "informant" | "monster" | "simulation" | "qr_quest"
  | "peer_gift"     | "correction"

interface Team {
  id: string; name: string; unitId: string
  memberIds: string[]; points: number; color: string
}
interface Character {
  id: string; code: string; name: string; nickname?: string
  role: Role; teamId?: string; unitId?: string; circleIds: string[]
  specialization?: Specialization; kaichiLevel: number
  points: number; peerPointPool: number; lessonClaimedThisWindow: boolean
}
interface Circle  { id: string; name: string; memberIds: string[] }
interface Unit    { id: string; name: string; teamIds: [string, string] }
interface PointEntry {
  id: string; timestamp: Date; sourceRole: Role
  sourceCharacterId: string; targetType: "team" | "unit" | "circle"
  targetId: string; resolvedTeamIds: string[]
  amount: number; actionType: ActionType; note?: string
}
interface MiasmaEntry {
  id: string; timestamp: Date; amount: number
  sourceCharacterId: string; note: string
}
interface QRCode {
  id: string; token: string; label: string
  targetType: "team" | "unit" | "circle"; targetId: string
  points: number; validity: "once" | "timed" | "repeat"
  validUntil?: Date; timesScanned: number
  status: "active" | "expired" | "used"; createdAt: Date
}
interface AlarmState {
  active: boolean
  type: "evacuation" | "battle" | "assembly" | "custom"
  message: string; color: string
}


// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const TEAMS: Team[] = [
  { id:"T01", name:"Tým 1",  unitId:"U1", memberIds:["S001","S002","S003"], points:145, color:"#e05252" },
  { id:"T02", name:"Tým 2",  unitId:"U1", memberIds:["S004","S005","S006"], points:130, color:"#e09832" },
  { id:"T03", name:"Tým 3",  unitId:"U2", memberIds:["S007","S008","S009"], points:160, color:"#5268e0" },
  { id:"T04", name:"Tým 4",  unitId:"U2", memberIds:["S010","S011","S012"], points: 90, color:"#52b0e0" },
  { id:"T05", name:"Tým 5",  unitId:"U5", memberIds:["S013","S014","S015"], points:120, color:"#52d4b4" },
  { id:"T06", name:"Tým 6",  unitId:"U5", memberIds:["S016","S017","S018"], points:175, color:"#d4a017" },
  { id:"T07", name:"Tým 7",  unitId:"U3", memberIds:["S019","S020","S021"], points:110, color:"#a052e0" },
  { id:"T08", name:"Tým 8",  unitId:"U3", memberIds:["S022","S023","S024"], points:100, color:"#52c452" },
  { id:"T09", name:"Tým 9",  unitId:"U4", memberIds:["S025","S026","S027"], points:155, color:"#e052b4" },
  { id:"T10", name:"Tým 10", unitId:"U4", memberIds:["S028","S029","S030"], points:140, color:"#e0cc52" },
]

// ─── Team icons ───────────────────────────────────────────────────────────────
type TablerIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }>
const TEAM_ICONS: Record<string, TablerIcon> = {
  T01: IconCat,         // kočka
  T02: IconCrown,       // korunka
  T03: IconSwords,      // meče
  T04: IconFlame,       // oheň
  T05: IconMask,        // liška / přestrojení
  T06: IconBrush,       // štětec / kaligrafie
  T07: IconPaw,         // vlk
  T08: IconUsersGroup,  // tři bratři
  T09: IconRosette,     // růže
  T10: IconCpu,         // čip / techno
}

const UNITS: Unit[] = [
  { id:"U1", name:"Murakami", teamIds:["T01","T02"] },
  { id:"U2", name:"Hagakure", teamIds:["T03","T04"] },
  { id:"U3", name:"Hvězdy",   teamIds:["T07","T08"] },
  { id:"U4", name:"V.I.R.A.", teamIds:["T09","T10"] },
  { id:"U5", name:"Utsuro",   teamIds:["T05","T06"] },
]

const CIRCLES: Circle[] = [
  { id:"C1", name:"Kuchi-Kuchi",     memberIds:["S003","S009","S015","S021","S026"] },
  { id:"C2", name:"Kaligrafie",      memberIds:["S016","S017","S018","S006","S012"] },
  { id:"C3", name:"Vědecký",         memberIds:["S030","S002","S008","S011","S020"] },
  { id:"C4", name:"Rituální",        memberIds:["S023","S001","S010","S019","S024"] },
  { id:"C5", name:"Akano Shōko-dan", memberIds:["S025","S026","S027","S004","S013"] },
  { id:"C6", name:"Literární",       memberIds:["S007","S014","S022","S028","S029"] },
]

const CHARACTERS: Character[] = [
  // ── GM ───────────────────────────────────────────────────────────────────────
  { id:"GM1",  code:"GM-001",   name:"Arakami",   role:"gm",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  // ── Učitelé / dospělí ────────────────────────────────────────────────────────
  { id:"TCH1", code:"TCH-001",  name:"Shiranagi", role:"teacher",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH2", code:"TCH-002",  name:"Nakamura",  role:"teacher",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH3", code:"TCH-003",  name:"Ibuki",     role:"teacher",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH4", code:"TCH-004",  name:"Karasu",    role:"teacher",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH5", code:"TCH-005",  name:"Okuda",     role:"teacher",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  // ── Obrazovky ────────────────────────────────────────────────────────────────
  { id:"DSP1", code:"SCREEN-A", name:"Obrazovka A", role:"display",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"DSP2", code:"SCREEN-B", name:"Obrazovka B", role:"display",
    circleIds:[], kaichiLevel:0, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  // ── Tým 1 ────────────────────────────────────────────────────────────────────
  { id:"S001", code:"STU-001", name:"Mushashi", nickname:"Drsňák",      role:"student",
    teamId:"T01", unitId:"U1", circleIds:["C4"], specialization:"combat",
    kaichiLevel:4, points:52, peerPointPool:18, lessonClaimedThisWindow:false },
  { id:"S002", code:"STU-002", name:"Shigen",   nickname:"Zmatený",     role:"student",
    teamId:"T01", unitId:"U1", circleIds:["C3"], specialization:"tactical",
    kaichiLevel:3, points:48, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S003", code:"STU-003", name:"Mimi",     nickname:"Pečovatelka", role:"student",
    teamId:"T01", unitId:"U1", circleIds:["C1"], specialization:"support",
    kaichiLevel:3, points:45, peerPointPool:20, lessonClaimedThisWindow:false },
  // ── Tým 2 ────────────────────────────────────────────────────────────────────
  { id:"S004", code:"STU-004", name:"Kaya",  nickname:"Princezna",   role:"student",
    teamId:"T02", unitId:"U1", circleIds:["C5"], specialization:"tactical",
    kaichiLevel:3, points:44, peerPointPool:17, lessonClaimedThisWindow:false },
  { id:"S005", code:"STU-005", name:"Kaoru", nickname:"Kluk ze vsi", role:"student",
    teamId:"T02", unitId:"U1", circleIds:["C6"], specialization:"support",
    kaichiLevel:2, points:42, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S006", code:"STU-006", name:"Hiko",  nickname:"Služebník",   role:"student",
    teamId:"T02", unitId:"U1", circleIds:["C2"], specialization:"tactical",
    kaichiLevel:2, points:44, peerPointPool:20, lessonClaimedThisWindow:false },
  // ── Tým 3 ────────────────────────────────────────────────────────────────────
  { id:"S007", code:"STU-007", name:"Ikai",  nickname:"Vůdkyně",              role:"student",
    teamId:"T03", unitId:"U2", circleIds:["C6"], specialization:"tactical",
    kaichiLevel:5, points:56, peerPointPool:12, lessonClaimedThisWindow:false },
  { id:"S008", code:"STU-008", name:"Raiji", nickname:"Zavázaný povinností",  role:"student",
    teamId:"T03", unitId:"U2", circleIds:["C3"], specialization:"combat",
    kaichiLevel:4, points:54, peerPointPool:15, lessonClaimedThisWindow:false },
  { id:"S009", code:"STU-009", name:"Airi",  nickname:"Ztracená",             role:"student",
    teamId:"T03", unitId:"U2", circleIds:["C1"], specialization:"support",
    kaichiLevel:4, points:50, peerPointPool:20, lessonClaimedThisWindow:false },
  // ── Tým 4 ────────────────────────────────────────────────────────────────────
  { id:"S010", code:"STU-010", name:"Yuri", nickname:"Hledačka pravdy", role:"student",
    teamId:"T04", unitId:"U2", circleIds:["C4"], specialization:"tactical",
    kaichiLevel:2, points:30, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S011", code:"STU-011", name:"Saya", nickname:"Ta Pečlivá",      role:"student",
    teamId:"T04", unitId:"U2", circleIds:["C3"], specialization:"support",
    kaichiLevel:2, points:30, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S012", code:"STU-012", name:"Ren",  nickname:"Nezlomný",        role:"student",
    teamId:"T04", unitId:"U2", circleIds:["C2"], specialization:"tactical",
    kaichiLevel:1, points:30, peerPointPool:20, lessonClaimedThisWindow:false },
  // ── Tým 5 ────────────────────────────────────────────────────────────────────
  { id:"S013", code:"STU-013", name:"Tetsuya", nickname:"Zklamaný",   role:"student",
    teamId:"T05", unitId:"U5", circleIds:["C5"], specialization:"combat",
    kaichiLevel:3, points:42, peerPointPool:18, lessonClaimedThisWindow:false },
  { id:"S014", code:"STU-014", name:"Itsuki",  nickname:"Ten druhý",  role:"student",
    teamId:"T05", unitId:"U5", circleIds:["C6"], specialization:"support",
    kaichiLevel:2, points:39, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S015", code:"STU-015", name:"Akari",   nickname:"Osamělá",    role:"student",
    teamId:"T05", unitId:"U5", circleIds:["C1"], specialization:"tactical",
    kaichiLevel:3, points:39, peerPointPool:20, lessonClaimedThisWindow:false },
  // ── Tým 6 ────────────────────────────────────────────────────────────────────
  { id:"S016", code:"STU-016", name:"Ayumi",   nickname:"Pátrající",      role:"student",
    teamId:"T06", unitId:"U5", circleIds:["C2"], specialization:"tactical",
    kaichiLevel:4, points:58, peerPointPool:15, lessonClaimedThisWindow:false },
  { id:"S017", code:"STU-017", name:"Mizuki",  nickname:"Průměrný",       role:"student",
    teamId:"T06", unitId:"U5", circleIds:["C2"], specialization:"tactical",
    kaichiLevel:2, points:55, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S018", code:"STU-018", name:"Yoshika", nickname:"Chlouba rodiny", role:"student",
    teamId:"T06", unitId:"U5", circleIds:["C2"], specialization:"combat",
    kaichiLevel:3, points:62, peerPointPool:18, lessonClaimedThisWindow:false },
  // ── Tým 7 ────────────────────────────────────────────────────────────────────
  { id:"S019", code:"STU-019", name:"Shiho",  nickname:"Kapitánka", role:"student",
    teamId:"T07", unitId:"U3", circleIds:["C4"], specialization:"combat",
    kaichiLevel:5, points:36, peerPointPool:14, lessonClaimedThisWindow:false },
  { id:"S020", code:"STU-020", name:"Yusuke", nickname:"Bídák",     role:"student",
    teamId:"T07", unitId:"U3", circleIds:["C3"], specialization:"tactical",
    kaichiLevel:2, points:37, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S021", code:"STU-021", name:"Anna",   nickname:"Cizačka",   role:"student",
    teamId:"T07", unitId:"U3", circleIds:["C1"], specialization:"support",
    kaichiLevel:3, points:37, peerPointPool:20, lessonClaimedThisWindow:false },
  // ── Tým 8 ────────────────────────────────────────────────────────────────────
  { id:"S022", code:"STU-022", name:"Kei",    nickname:"Dědic",    role:"student",
    teamId:"T08", unitId:"U3", circleIds:["C6"], specialization:"combat",
    kaichiLevel:3, points:33, peerPointPool:18, lessonClaimedThisWindow:false },
  { id:"S023", code:"STU-023", name:"Ryo",    nickname:"Oblíbený", role:"student",
    teamId:"T08", unitId:"U3", circleIds:["C4"], specialization:"support",
    kaichiLevel:2, points:34, peerPointPool:20, lessonClaimedThisWindow:false },
  { id:"S024", code:"STU-024", name:"Haruka", nickname:"Chudinka", role:"student",
    teamId:"T08", unitId:"U3", circleIds:["C4"], specialization:"support",
    kaichiLevel:1, points:33, peerPointPool:20, lessonClaimedThisWindow:false },
  // ── Tým 9 ────────────────────────────────────────────────────────────────────
  { id:"S025", code:"STU-025", name:"Tomoe",    nickname:"Princ",   role:"student",
    teamId:"T09", unitId:"U4", circleIds:["C5"], specialization:"tactical",
    kaichiLevel:3, points:52, peerPointPool:18, lessonClaimedThisWindow:false },
  // Nozomi = Růže (studentka s rozšířenými právy)
  { id:"S026", code:"RUZE-001", name:"Nozomi",   nickname:"Růže",    role:"ruze",
    teamId:"T09", unitId:"U4", circleIds:["C1","C5"], specialization:"support",
    kaichiLevel:4, points:53, peerPointPool:12, lessonClaimedThisWindow:false },
  { id:"S027", code:"STU-027", name:"Sestsuko",  nickname:"Kometa",  role:"student",
    teamId:"T09", unitId:"U4", circleIds:["C5"], specialization:"combat",
    kaichiLevel:3, points:50, peerPointPool:18, lessonClaimedThisWindow:false },
  // ── Tým 10 ───────────────────────────────────────────────────────────────────
  { id:"S028", code:"STU-028", name:"Kenzo",   nickname:"Oheň",   role:"student",
    teamId:"T10", unitId:"U4", circleIds:["C6"], specialization:"tactical",
    kaichiLevel:3, points:46, peerPointPool:18, lessonClaimedThisWindow:false },
  { id:"S029", code:"STU-029", name:"Makoto",  nickname:"Voda",   role:"student",
    teamId:"T10", unitId:"U4", circleIds:["C6"], specialization:"combat",
    kaichiLevel:4, points:47, peerPointPool:15, lessonClaimedThisWindow:false },
  { id:"S030", code:"STU-030", name:"Chiharu", nickname:"Vzduch", role:"student",
    teamId:"T10", unitId:"U4", circleIds:["C3"], specialization:"support",
    kaichiLevel:2, points:47, peerPointPool:20, lessonClaimedThisWindow:false },
]

// ─── Point log (seeded 2-day history) ────────────────────────────────────────
const BASE_TIME = new Date("2026-04-22T09:00:00")
function t(offsetMin: number) { return new Date(BASE_TIME.getTime() + offsetMin * 60000) }

const INITIAL_POINT_LOG: PointEntry[] = [
  { id:"PE01", timestamp:t(10),  sourceRole:"teacher", sourceCharacterId:"TCH1", targetType:"team",   targetId:"T06", resolvedTeamIds:["T06"], amount:20, actionType:"mission_success", note:"Průzkum západního křídla" },
  { id:"PE02", timestamp:t(25),  sourceRole:"teacher", sourceCharacterId:"TCH2", targetType:"unit",   targetId:"U2",  resolvedTeamIds:["T03","T04"], amount:15, actionType:"lesson", note:"Hodina historie" },
  { id:"PE03", timestamp:t(40),  sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T01", resolvedTeamIds:["T01"], amount:25, actionType:"mission_success", note:"Mise alfa dokončena" },
  { id:"PE04", timestamp:t(55),  sourceRole:"teacher", sourceCharacterId:"TCH1", targetType:"team",   targetId:"T09", resolvedTeamIds:["T09"], amount:20, actionType:"monster", note:"Stráž poraženar" },
  { id:"PE05", timestamp:t(70),  sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T03", resolvedTeamIds:["T03"], amount:30, actionType:"mission_success", note:"Špionáž úspěšná" },
  { id:"PE06", timestamp:t(90),  sourceRole:"ruze",    sourceCharacterId:"RUZ1", targetType:"circle", targetId:"C6",  resolvedTeamIds:["T01","T03","T04"], amount:10, actionType:"simulation", note:"Bojový turnaj" },
  { id:"PE07", timestamp:t(110), sourceRole:"teacher", sourceCharacterId:"TCH2", targetType:"unit",   targetId:"U4",  resolvedTeamIds:["T07","T08"], amount:15, actionType:"lesson" },
  { id:"PE08", timestamp:t(130), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T06", resolvedTeamIds:["T06"], amount:20, actionType:"shidosei" },
  { id:"PE09", timestamp:t(150), sourceRole:"teacher", sourceCharacterId:"TCH1", targetType:"team",   targetId:"T02", resolvedTeamIds:["T02"], amount:-10, actionType:"correction", note:"Oprava — duplikát" },
  { id:"PE10", timestamp:t(170), sourceRole:"teacher", sourceCharacterId:"TCH2", targetType:"team",   targetId:"T05", resolvedTeamIds:["T05"], amount:20, actionType:"mission_success" },
  { id:"PE11", timestamp:t(200), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"unit",   targetId:"U3",  resolvedTeamIds:["T05","T06"], amount:25, actionType:"mission_success", note:"Mise Omega splněna" },
  { id:"PE12", timestamp:t(230), sourceRole:"ruze",    sourceCharacterId:"RUZ1", targetType:"team",   targetId:"T07", resolvedTeamIds:["T07"], amount:15, actionType:"informant" },
  { id:"PE13", timestamp:t(260), sourceRole:"teacher", sourceCharacterId:"TCH1", targetType:"unit",   targetId:"U1",  resolvedTeamIds:["T01","T02"], amount:15, actionType:"lesson" },
  { id:"PE14", timestamp:t(300), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T09", resolvedTeamIds:["T09"], amount:20, actionType:"qr_quest" },
  { id:"PE15", timestamp:t(340), sourceRole:"teacher", sourceCharacterId:"TCH2", targetType:"circle", targetId:"C1",  resolvedTeamIds:["T01","T02","T04"], amount:10, actionType:"simulation", note:"Sportovní kruh — turnaj" },
  { id:"PE16", timestamp:t(380), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T10", resolvedTeamIds:["T10"], amount:30, actionType:"mission_success" },
  { id:"PE17", timestamp:t(420), sourceRole:"teacher", sourceCharacterId:"TCH1", targetType:"team",   targetId:"T03", resolvedTeamIds:["T03"], amount:15, actionType:"lesson" },
  { id:"PE18", timestamp:t(460), sourceRole:"ruze",    sourceCharacterId:"RUZ1", targetType:"unit",   targetId:"U5",  resolvedTeamIds:["T09","T10"], amount:20, actionType:"mission_success", note:"Noc infiltrátorů" },
  { id:"PE19", timestamp:t(500), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T04", resolvedTeamIds:["T04"], amount:10, actionType:"shidosei" },
  { id:"PE20", timestamp:t(540), sourceRole:"teacher", sourceCharacterId:"TCH2", targetType:"unit",   targetId:"U2",  resolvedTeamIds:["T03","T04"], amount:15, actionType:"lesson" },
  // Day 2
  { id:"PE21", timestamp:t(780), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T06", resolvedTeamIds:["T06"], amount:25, actionType:"mission_success", note:"Ráno druhého dne" },
  { id:"PE22", timestamp:t(820), sourceRole:"teacher", sourceCharacterId:"TCH1", targetType:"circle", targetId:"C2",  resolvedTeamIds:["T01","T03","T05"], amount:10, actionType:"simulation" },
  { id:"PE23", timestamp:t(860), sourceRole:"ruze",    sourceCharacterId:"RUZ1", targetType:"team",   targetId:"T08", resolvedTeamIds:["T08"], amount:20, actionType:"monster" },
  { id:"PE24", timestamp:t(900), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"unit",   targetId:"U3",  resolvedTeamIds:["T05","T06"], amount:15, actionType:"lesson" },
  { id:"PE25", timestamp:t(940), sourceRole:"teacher", sourceCharacterId:"TCH2", targetType:"team",   targetId:"T09", resolvedTeamIds:["T09"], amount:20, actionType:"qr_quest", note:"QR kód — sklep" },
  { id:"PE26", timestamp:t(980), sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T02", resolvedTeamIds:["T02"], amount:30, actionType:"mission_success" },
  { id:"PE27", timestamp:t(1020),sourceRole:"teacher", sourceCharacterId:"TCH1", targetType:"unit",   targetId:"U4",  resolvedTeamIds:["T07","T08"], amount:15, actionType:"mission_success" },
  { id:"PE28", timestamp:t(1060),sourceRole:"ruze",    sourceCharacterId:"RUZ1", targetType:"team",   targetId:"T01", resolvedTeamIds:["T01"], amount:20, actionType:"shidosei" },
  { id:"PE29", timestamp:t(1100),sourceRole:"gm",      sourceCharacterId:"GM1",  targetType:"team",   targetId:"T07", resolvedTeamIds:["T07"], amount:15, actionType:"informant" },
  { id:"PE30", timestamp:t(1140),sourceRole:"teacher", sourceCharacterId:"TCH2", targetType:"circle", targetId:"C6",  resolvedTeamIds:["T01","T03","T04"], amount:15, actionType:"simulation", note:"Bojový kruh — výsledky" },
]

const INITIAL_QR_CODES: QRCode[] = [
  { id:"QR01", token:"akn-abc123", label:"Sklep — průzkum", targetType:"team", targetId:"T09",
    points:20, validity:"once", timesScanned:1, status:"used", createdAt:t(880) },
  { id:"QR02", token:"akn-def456", label:"Věžní místnost", targetType:"unit", targetId:"U2",
    points:15, validity:"timed", validUntil:new Date("2026-04-23T20:00:00"), timesScanned:0, status:"active", createdAt:t(950) },
  { id:"QR03", token:"akn-ghi789", label:"Chodba — tajná zpráva", targetType:"circle", targetId:"C3",
    points:10, validity:"repeat", timesScanned:3, status:"active", createdAt:t(800) },
]


// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const ROMAN = ["","I","II","III","IV","V","VI","VII","VIII"]
const romanNumeral = (n: number) => ROMAN[n] ?? String(n)

function formatTime(d: Date) {
  return d.toLocaleTimeString("cs-CZ", { hour:"2-digit", minute:"2-digit" })
}
function formatDateTime(d: Date) {
  return d.toLocaleString("cs-CZ", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })
}

const ACTION_LABELS: Record<ActionType, string> = {
  mission_success: "Mise — úspěch",
  mission_fail:    "Mise — neúspěch",
  lesson:          "Hodina",
  shidosei:        "Shidōsei",
  informant:       "Bonzování",
  monster:         "Monstrum",
  simulation:      "Simulace / soutěž",
  qr_quest:        "QR quest",
  peer_gift:       "Dar spolužákovi",
  correction:      "Korekce",
}
const ACTION_DEFAULT_PTS: Record<ActionType, number> = {
  mission_success:20, mission_fail:-5, lesson:5, shidosei:15,
  informant:10, monster:20, simulation:10, qr_quest:15, peer_gift:5, correction:0,
}

function resolveTargetTeams(
  targetType: "team"|"unit"|"circle",
  targetId: string
): string[] {
  if (targetType === "team")   return [targetId]
  if (targetType === "unit") {
    const u = UNITS.find(u => u.id === targetId)
    return u ? [...u.teamIds] : []
  }
  const c = CIRCLES.find(c => c.id === targetId)
  if (!c) return []
  return [...new Set(c.memberIds.map(mid => {
    const ch = CHARACTERS.find(ch => ch.id === mid)
    return ch?.teamId
  }).filter(Boolean) as string[])]
}

function getTeamName(id: string)   { return TEAMS.find(t => t.id === id)?.name ?? id }
function getUnitName(id: string)   { return UNITS.find(u => u.id === id)?.name ?? id }
function getCircleName(id: string) { return CIRCLES.find(c => c.id === id)?.name ?? id }
function getTargetName(type: "team"|"unit"|"circle", id: string) {
  if (type === "team")   return getTeamName(id)
  if (type === "unit")   return getUnitName(id)
  return getCircleName(id)
}
function getCharName(id: string) {
  return CHARACTERS.find(c => c.id === id)?.name ?? id
}


// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT — central in-memory game state (replaces Zustand for single file)
// REALTIME_HOOK: In production, connect Zustand store to WebSocket/SSE here
// ═══════════════════════════════════════════════════════════════════════════════

interface Toast { id: string; message: string; type: "success"|"error"|"info" }

interface GameCtx {
  // State
  teams:           Team[]
  characters:      Character[]
  pointLog:        PointEntry[]
  miasmaValue:     number
  miasmaLog:       MiasmaEntry[]
  alarmState:      AlarmState
  broadcastActive: boolean
  lessonWindowActive: boolean
  lessonWindowEnd: Date | null
  qrCodes:         QRCode[]
  toasts:          Toast[]
  currentUser:     Character | null
  currentScreen:   string
  // Actions
  login:           (code: string) => boolean
  logout:          () => void
  navigate:        (screen: string) => void
  assignPoints:    (entry: Omit<PointEntry,"id"|"timestamp"|"resolvedTeamIds">) => void
  updateKaichi:    (characterId: string) => void
  updateMiasma:    (amount: number, note: string) => void
  triggerAlarm:    (type: AlarmState["type"], message: string) => void
  dismissAlarm:    () => void
  setBroadcast:    (active: boolean) => void
  generateQR:      (cfg: Omit<QRCode,"id"|"token"|"timesScanned"|"status"|"createdAt">) => void
  toggleLesson:    (active: boolean, durationMin?: number) => void
  giftPoints:      (fromId: string, toId: string, amount: number) => void
  claimLesson:     (studentId: string) => void
  addToast:        (msg: string, type?: Toast["type"]) => void
}

const GameContext = createContext<GameCtx | null>(null)
function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be inside GameProvider")
  return ctx
}

function GameProvider({ children }: { children: React.ReactNode }) {
  const [teams,           setTeams]           = useState<Team[]>([...TEAMS])
  const [characters,      setCharacters]      = useState<Character[]>([...CHARACTERS])
  const [pointLog,        setPointLog]        = useState<PointEntry[]>([...INITIAL_POINT_LOG])
  const [miasmaValue,     setMiasmaValue]     = useState(47)
  const [miasmaLog,       setMiasmaLog]       = useState<MiasmaEntry[]>([])
  const [alarmState,      setAlarmState]      = useState<AlarmState>({ active:false, type:"evacuation", message:"", color:"#c0392b" })
  const [broadcastActive, setBroadcastActive] = useState(false)
  const [lessonWindowActive, setLessonWindowActive] = useState(false)
  const [lessonWindowEnd, setLessonWindowEnd] = useState<Date|null>(null)
  const [qrCodes,         setQrCodes]         = useState<QRCode[]>([...INITIAL_QR_CODES])
  const [toasts,          setToasts]          = useState<Toast[]>([])
  const [currentUser,     setCurrentUser]     = useState<Character|null>(null)
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
    entry: Omit<PointEntry,"id"|"timestamp"|"resolvedTeamIds">
  ) => {
    const resolvedTeamIds = resolveTargetTeams(entry.targetType, entry.targetId)
    const full: PointEntry = {
      ...entry,
      id:              `PE${Date.now()}`,
      timestamp:       new Date(),
      resolvedTeamIds,
    }
    setPointLog(prev => [full, ...prev])
    setTeams(prev => prev.map(t =>
      resolvedTeamIds.includes(t.id)
        ? { ...t, points: t.points + entry.amount }
        : t
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

  const ALARM_COLORS: Record<AlarmState["type"], string> = {
    evacuation:"#c0392b", battle:"#d4813a", assembly:"#c8a917", custom:"#7d1520"
  }
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
    // TODO: Replace with actual WebRTC peer connection (simple-peer or RTCPeerConnection)
  }, [])

  const generateQR = useCallback((cfg: Omit<QRCode,"id"|"token"|"timesScanned"|"status"|"createdAt">) => {
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
    setCharacters(prev => prev.map(c =>
      c.id === fromId ? { ...c, peerPointPool: c.peerPointPool - amount } : c
    ))
    const from = characters.find(c => c.id === fromId)
    const to   = characters.find(c => c.id === toId)
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
    setCharacters(prev => prev.map(c =>
      c.id === studentId ? { ...c, lessonClaimedThisWindow: true } : c
    ))
    const student = characters.find(c => c.id === studentId)
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


// ═══════════════════════════════════════════════════════════════════════════════
// SMALL SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function KaichiBadge({ level }: { level: number }) {
  if (!level) return null
  return (
    <span style={{
      display:"inline-block", backgroundColor:"#1a0a00", color:"#d4a017",
      fontFamily:"'Courier New', monospace", fontWeight:"bold",
      padding:"2px 10px", borderRadius:"4px", fontSize:"0.8rem",
      border:"1px solid #d4a01770", letterSpacing:"0.05em",
    }}>
      Kaichi {romanNumeral(level)}
    </span>
  )
}

function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, [string,string]> = {
    gm:      ["#2a8a8a","GM"],
    teacher: ["#5252e0","Učitel"],
    ruze:    ["#e052b4","Růže"],
    student: ["#52b0e0","Student"],
    display: ["#888","Obrazovka"],
  }
  const [color, label] = map[role]
  return (
    <span style={{
      backgroundColor: color + "33", color, border:`1px solid ${color}66`,
      padding:"2px 8px", borderRadius:"4px", fontSize:"0.75rem", fontWeight:600,
    }}>
      {label}
    </span>
  )
}

function ActionBadge({ type }: { type: ActionType }) {
  const colors: Record<ActionType,string> = {
    mission_success:"#2a8a5a", mission_fail:"#c0392b", lesson:"#5252e0",
    shidosei:"#d4a017",         informant:"#e07832",   monster:"#a052e0",
    simulation:"#52b0e0",       qr_quest:"#2a8a8a",   peer_gift:"#e052b4",
    correction:"#888",
  }
  const c = colors[type]
  return (
    <span style={{
      backgroundColor: c + "22", color: c, border:`1px solid ${c}44`,
      padding:"2px 7px", borderRadius:"4px", fontSize:"0.72rem", fontWeight:500,
      whiteSpace:"nowrap",
    }}>
      {ACTION_LABELS[type]}
    </span>
  )
}

function TeamIcon({ teamId, color, size = 16, strokeWidth = 1.8 }: { teamId?: string; color?: string; size?: number; strokeWidth?: number }) {
  const team   = teamId ? TEAMS.find(t => t.id === teamId) : undefined
  const fill   = color ?? team?.color ?? "#888"
  const Icon   = teamId ? (TEAM_ICONS[teamId] ?? IconShield) : IconShield
  return <Icon size={size} color={fill} strokeWidth={strokeWidth} style={{ flexShrink:0 }} />
}
// legacy alias — keep so existing call-sites that pass only color still compile
function TeamDot({ color, teamId }: { color: string; teamId?: string }) {
  return <TeamIcon teamId={teamId} color={color} size={15} />
}

function SpecBadge({ spec }: { spec?: Specialization }) {
  if (!spec) return null
  const map: Record<Specialization,[string,string]> = {
    combat:  ["#e05252","Bojový"],
    tactical:["#5268e0","Taktický"],
    support: ["#52d4b4","Podpora"],
  }
  const [c, label] = map[spec]
  return (
    <span style={{
      backgroundColor: c + "22", color: c, border:`1px solid ${c}44`,
      padding:"1px 7px", borderRadius:"4px", fontSize:"0.72rem",
    }}>
      {label}
    </span>
  )
}

// ─── Toast notifications ──────────────────────────────────────────────────────
function ToastContainer() {
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

// ─── Persistent alarm banner ──────────────────────────────────────────────────
function AlarmBannerStrip() {
  const { alarmState } = useGame()
  if (!alarmState.active) return null
  return (
    <div style={{
      backgroundColor:"#c0392b", color:"#fff",
      padding:"6px 16px", textAlign:"center",
      fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.05em",
    }}>
      <IconBellRinging size={14} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }} />
      ALARM AKTIVNÍ: {alarmState.message || alarmState.type.toUpperCase()}
    </div>
  )
}

// ─── Broadcast button (for Teacher/GM/Růže top bar) ──────────────────────────
function BroadcastButton() {
  const { broadcastActive, setBroadcast } = useGame()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={() => setBroadcast(!broadcastActive)}
          render={<button />}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"6px 12px", borderRadius:6,
            backgroundColor: broadcastActive ? "#c0392b" : "transparent",
            border: `1px solid ${broadcastActive ? "#c0392b" : "#a0263380"}`,
            color: broadcastActive ? "#fff" : "#c8a96e",
            cursor:"pointer", fontSize:"0.8rem", fontWeight:600,
            transition:"all 0.2s",
          }}
        >
          {broadcastActive
            ? <><IconMicrophone size={14} className="alarm-pulse" /> Vysíláte ŽIVĚ</>
            : <><IconMicrophoneOff size={14} /> Rozhlas</>}
        </TooltipTrigger>
        <TooltipContent>
          {broadcastActive ? "Zastavit vysílání" : "Spustit rozhlas"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ─── Admin shell top bar ──────────────────────────────────────────────────────
function TopBar({ showBroadcast = true }: { showBroadcast?: boolean }) {
  const { currentUser, logout, alarmState } = useGame()
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"10px 24px",
      backgroundColor:"#fff",
      borderBottom:"1px solid rgba(107,15,26,0.12)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span className="font-cinzel" style={{ color:"#6b0f1a", fontWeight:700, fontSize:"1.1rem", letterSpacing:"0.08em" }}>
          AKANO<span style={{ color:"#2a8a8a" }}>3</span>
        </span>
        {alarmState.active && (
          <span style={{ backgroundColor:"#c0392b33", color:"#e05252", border:"1px solid #c0392b55",
            padding:"2px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.04em" }}>
            <IconBellRinging size={11} style={{ display:"inline", marginRight:4 }} />
            ALARM
          </span>
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {showBroadcast && <BroadcastButton />}
        {currentUser && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#1a0a0a", fontSize:"0.85rem" }}>{currentUser.name}</span>
            <RoleBadge role={currentUser.role} />
          </div>
        )}
        <button onClick={logout} style={{
          background:"transparent", border:"1px solid rgba(107,15,26,0.2)",
          color:"rgba(107,15,26,0.5)", padding:"5px 10px", borderRadius:6,
          cursor:"pointer", display:"flex", alignItems:"center", gap:4,
          fontSize:"0.8rem",
        }}>
          <IconLogout size={14} /> Odejít
        </button>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function LoginScreen() {
  const { login } = useGame()
  const [code,  setCode]  = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setTimeout(() => {
      const ok = login(code)
      if (!ok) {
        setError("Neplatný kód. Zkontroluj zápis a zkus znovu.")
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"radial-gradient(ellipse at 50% 0%, #f5ede8 0%, #faf7f2 60%)",
      padding:24,
    }}>
      {/* Decorative vertical lines */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {[10,25,75,90].map(pct => (
          <div key={pct} style={{
            position:"absolute", top:0, bottom:0, left:`${pct}%`,
            width:1, background:"linear-gradient(to bottom, transparent, rgba(107,15,26,0.08), transparent)",
          }} />
        ))}
      </div>

      <div style={{ width:"100%", maxWidth:420, position:"relative" }}>
        {/* Logo / Title */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            width:72, height:72, borderRadius:"50%",
            background:"#fff",
            border:"2px solid rgba(107,15,26,0.25)", marginBottom:20,
            boxShadow:"0 4px 24px rgba(107,15,26,0.12)",
          }}>
            <IconSword size={32} color="#6b0f1a" />
          </div>
          <h1 className="font-cinzel" style={{
            fontSize:"3rem", fontWeight:900, letterSpacing:"0.2em",
            color:"#1a0a0a", margin:0, lineHeight:1,
          }}>
            AKANO<span style={{ color:"#2a8a8a" }}>3</span>
          </h1>
          <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.75rem", letterSpacing:"0.3em", marginTop:8 }}>
            SYSTÉM SPRÁVY HRY
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor:"#fff",
          border:"1px solid rgba(107,15,26,0.15)", borderRadius:12,
          padding:32, boxShadow:"0 4px 32px rgba(107,15,26,0.08)",
        }}>
          <h2 style={{ color:"#1a0a0a", fontSize:"1rem", fontWeight:600,
            marginBottom:6, textAlign:"center" }}>
            Přihlášení
          </h2>
          <p style={{ color:"rgba(107,15,26,0.5)", fontSize:"0.8rem", textAlign:"center", marginBottom:24 }}>
            Zadej svůj herní kód postavy
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <Label htmlFor="code" style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.05em", fontWeight:600 }}>
                KÓD POSTAVY
              </Label>
              <Input
                id="code"
                value={code}
                onChange={e => { setCode(e.target.value); setError("") }}
                placeholder="např. GM-001, STU-007, SCREEN-A"
                autoFocus
                autoComplete="off"
                style={{
                  marginTop:6,
                  backgroundColor:"#faf7f2",
                  border:"1px solid rgba(107,15,26,0.25)",
                  color:"#1a0a0a",
                  letterSpacing:"0.1em",
                  fontFamily:"'Courier New', monospace",
                  fontSize:"1rem",
                }}
              />
            </div>

            {error && (
              <Alert style={{ backgroundColor:"#fef2f2", border:"1px solid rgba(192,57,43,0.3)", marginBottom:16 }}>
                <AlertDescription style={{ color:"#c0392b", fontSize:"0.85rem" }}>
                  <IconCircleX size={14} style={{ display:"inline", marginRight:6 }} />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading || !code.trim()}
              style={{ width:"100%", backgroundColor:"#6b0f1a", color:"#fff", fontWeight:700, letterSpacing:"0.05em" }}
            >
              {loading ? "Ověřuji…" : "Vstoupit do hry"}
            </Button>
          </form>

          <Separator style={{ margin:"20px 0" }} />

          <p style={{ color:"rgba(107,15,26,0.4)", fontSize:"0.72rem", textAlign:"center" }}>
            <IconUser size={11} style={{ display:"inline", marginRight:4 }} />
            Kód ti dá organizátor
          </p>

          {/* Quick-access codes for prototype demo */}
          <div style={{ marginTop:16, padding:12, backgroundColor:"rgba(107,15,26,0.04)", borderRadius:8, border:"1px solid rgba(107,15,26,0.1)" }}>
            <p style={{ color:"rgba(107,15,26,0.4)", fontSize:"0.68rem", letterSpacing:"0.05em", marginBottom:8 }}>
              DEMO KÓDY
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {[
                ["GM-001","GM"], ["TCH-001","Učitel"], ["STU-007","Student"],
                ["SCREEN-A","Display"], ["RUZE-001","Růže"],
              ].map(([c, label]) => (
                <button key={c} onClick={() => setCode(c)} style={{
                  backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)",
                  color:"#6b0f1a", padding:"2px 8px", borderRadius:4,
                  fontSize:"0.7rem", cursor:"pointer", fontFamily:"monospace",
                }}>
                  {c} <span style={{ opacity:.6 }}>({label})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// SCOREBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ScoreboardComponent({
  mode = "teams",
  compact = false,
  highlightId,
  onModeChange,
  showModeToggle = false,
}: {
  mode?: "teams"|"units"|"circles"
  compact?: boolean
  highlightId?: string
  onModeChange?: (m: "teams"|"units"|"circles") => void
  showModeToggle?: boolean
}) {
  const { teams, pointLog } = useGame()

  // Build sorted rows
  const rows = useMemo(() => {
    if (mode === "teams") {
      return [...teams].sort((a,b) => b.points - a.points).map((t,i) => ({
        id: t.id, name: t.name, points: t.points, color: t.color, rank: i+1,
      }))
    }
    if (mode === "units") {
      return UNITS.map(u => {
        const pts = u.teamIds.reduce((s,tid) => s + (teams.find(t=>t.id===tid)?.points??0), 0)
        return { id:u.id, name:u.name, points:pts, color:"#2a8a8a", rank:0 }
      }).sort((a,b)=>b.points-a.points).map((r,i)=>({...r, rank:i+1}))
    }
    return CIRCLES.map(c => {
      const memberTeams = [...new Set(c.memberIds.map(mid => CHARACTERS.find(ch=>ch.id===mid)?.teamId).filter(Boolean) as string[])]
      const pts = memberTeams.reduce((s,tid) => s + (teams.find(t=>t.id===tid)?.points??0), 0)
      return { id:c.id, name:c.name, points:pts, color:"#a052e0", rank:0 }
    }).sort((a,b)=>b.points-a.points).map((r,i)=>({...r, rank:i+1}))
  }, [mode, teams])

  // Recent changes (last 2 mins)
  const recentChanges = useMemo(() => {
    const cutoff = new Date(Date.now() - 120000)
    const changes: Record<string,number> = {}
    pointLog.filter(e => e.timestamp > cutoff).forEach(e => {
      e.resolvedTeamIds.forEach(tid => { changes[tid] = (changes[tid]??0) + e.amount })
    })
    return changes
  }, [pointLog])

  const fontSize = compact ? "0.9rem" : "1rem"
  const ptSize   = compact ? "1.1rem" : "1.3rem"

  return (
    <div>
      {showModeToggle && (
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {(["teams","units","circles"] as const).map(m => (
            <button key={m} onClick={() => onModeChange?.(m)} style={{
              padding:"4px 12px", borderRadius:6, fontSize:"0.8rem", cursor:"pointer",
              backgroundColor: mode===m ? "#2a8a8a" : "rgba(107,15,26,0.06)",
              color: mode===m ? "#fff" : "#6b0f1a",
              border: `1px solid ${mode===m ? "#2a8a8a" : "rgba(107,15,26,0.2)"}`,
              fontWeight: mode===m ? 700 : 400,
            }}>
              {m==="teams" ? "Týmy" : m==="units" ? "Jednotky" : "Kruhy"}
            </button>
          ))}
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:compact ? 4 : 6 }}>
        {rows.map(row => {
          const change = recentChanges[row.id] ?? 0
          const isHL   = row.id === highlightId
          return (
            <div key={row.id} style={{
              display:"flex", alignItems:"center", gap:12,
              padding: compact ? "8px 12px" : "12px 16px",
              borderRadius:8,
              backgroundColor: isHL ? "rgba(42,138,138,0.1)" : "rgba(107,15,26,0.03)",
              border: `1px solid ${isHL ? "rgba(42,138,138,0.4)" : "rgba(107,15,26,0.1)"}`,
              transition:"all 0.3s",
            }}>
              <span style={{
                minWidth: compact ? 24 : 32, fontWeight:900,
                color: row.rank <= 3 ? "#b8860b" : "rgba(107,15,26,0.4)",
                fontSize: compact ? "0.85rem" : "1rem",
                fontFamily:"monospace",
              }}>
                {row.rank}
              </span>
              <TeamDot color={row.color} teamId={row.id} />
              <span style={{ flex:1, fontWeight:600, color:"#1a0a0a", fontSize }} className={isHL ? "font-cinzel" : ""}>
                {row.name}
              </span>
              {change !== 0 && (
                <span style={{
                  fontSize:"0.75rem", fontWeight:700,
                  color: change > 0 ? "#2a8a5a" : "#e05252",
                  minWidth:50, textAlign:"right",
                }}>
                  {change > 0 ? <IconChevronUp size={12} style={{display:"inline"}} /> : <IconChevronDown size={12} style={{display:"inline"}} />}
                  {change > 0 ? "+" : ""}{change}
                </span>
              )}
              <span style={{
                fontFamily:"monospace", fontWeight:900,
                color:"#6b0f1a", fontSize: ptSize,
                minWidth:60, textAlign:"right",
              }}>
                {row.points}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// POINT ASSIGNMENT FORM
// ═══════════════════════════════════════════════════════════════════════════════

function PointAssignmentForm({ onClose, canCorrect = false }: { onClose?: () => void; canCorrect?: boolean }) {
  const { assignPoints, currentUser, addToast } = useGame()
  const [targetType, setTargetType] = useState<"team"|"unit"|"circle">("team")
  const [targetId,   setTargetId]   = useState("")
  const [actionType, setActionType] = useState<ActionType>("mission_success")
  const [amount,     setAmount]     = useState(20)
  const [note,       setNote]       = useState("")
  const [confirm,    setConfirm]    = useState(false)

  const targetOptions = useMemo(() => {
    if (targetType === "team")   return TEAMS.map(t => ({ id:t.id, label:t.name }))
    if (targetType === "unit")   return UNITS.map(u => ({ id:u.id, label:u.name }))
    return CIRCLES.map(c => ({ id:c.id, label:c.name }))
  }, [targetType])

  const resolvedTeams = useMemo(() =>
    targetId ? resolveTargetTeams(targetType, targetId).map(getTeamName).join(", ") : "—"
  , [targetType, targetId])

  const actions = (canCorrect
    ? Object.entries(ACTION_LABELS)
    : Object.entries(ACTION_LABELS).filter(([k]) => k !== "correction")
  ) as [ActionType, string][]

  const handleSubmit = () => {
    if (!currentUser) { addToast("Nejsi přihlášen", "error"); return }
    if (!targetId || !amount) { addToast("Vyplň všechna pole", "error"); return }
    assignPoints({
      sourceRole: currentUser.role,
      sourceCharacterId: currentUser.id,
      targetType, targetId, amount, actionType,
      note: note || undefined,
    })
    setTargetId(""); setNote(""); setConfirm(false)
    onClose?.()
  }

  const sectionHead = (label: string) => (
    <p style={{ color:"#6b0f1a", fontSize:"0.72rem", letterSpacing:"0.1em", marginBottom:6, marginTop:16 }}>
      {label}
    </p>
  )

  return (
    <>
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>

        {sectionHead("CÍL")}
        <RadioGroup
          value={targetType}
          onValueChange={v => { setTargetType(v as any); setTargetId("") }}
          style={{ display:"flex", gap:8, marginBottom:8 }}
        >
          {(["team","unit","circle"] as const).map(t => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <RadioGroupItem value={t} id={`tt-${t}`} />
              <Label htmlFor={`tt-${t}`} style={{ color:"#1a0a0a", cursor:"pointer", fontSize:"0.85rem" }}>
                {t==="team" ? "Tým" : t==="unit" ? "Jednotka" : "Kruh"}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Select value={targetId} onValueChange={(v) => setTargetId(v ?? "")}>
          <SelectTrigger style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
            <SelectValue placeholder="Vyber cíl…" />
          </SelectTrigger>
          <SelectContent>
            {targetOptions.map(o => (
              <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {targetId && (
          <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.75rem", marginTop:4 }}>
            <IconChevronRight size={11} style={{display:"inline"}} /> Přijmou body: <strong style={{color:"#6b0f1a"}}>{resolvedTeams}</strong>
          </p>
        )}

        {sectionHead("TYP AKCE")}
        <Select value={actionType} onValueChange={v => {
          setActionType(v as ActionType)
          setAmount(ACTION_DEFAULT_PTS[v as ActionType] || 10)
        }}>
          <SelectTrigger style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {actions.map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        {sectionHead("POČET BODŮ")}
        <Input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          min={canCorrect ? undefined : 1}
          style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}
        />

        {sectionHead("POZNÁMKA (nepovinné)")}
        <Textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Stručný popis…"
          rows={2}
          style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", resize:"none" }}
        />

        <Button
          onClick={() => setConfirm(true)}
          disabled={!targetId}
          style={{ marginTop:20, backgroundColor:"#2a8a8a", color:"#fff", fontWeight:700 }}
        >
          <IconCheck size={16} style={{marginRight:6}} /> Zadat body
        </Button>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Potvrdit zadání bodů</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              <strong style={{color:"#2a8a8a", fontSize:"1.1rem"}}>{amount > 0 ? "+" : ""}{amount} bodů</strong>
              {" → "}<strong>{resolvedTeams}</strong>
              <br />{ACTION_LABELS[actionType]}
              {note && <><br /><em style={{color:"rgba(107,15,26,0.45)"}}>„{note}"</em></>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} style={{ backgroundColor:"#2a8a8a" }}>Potvrdit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION LOG
// ═══════════════════════════════════════════════════════════════════════════════

function TransactionLog({ maxRows, canExport = false }: { maxRows?: number; canExport?: boolean }) {
  const { pointLog } = useGame()
  const [filterRole,   setFilterRole]   = useState("")
  const [filterAction, setFilterAction] = useState("")
  const [filterTeam,   setFilterTeam]   = useState("")
  const [search,       setSearch]       = useState("")

  const filtered = useMemo(() => {
    let rows = [...pointLog]
    if (filterRole)   rows = rows.filter(e => e.sourceRole === filterRole)
    if (filterAction) rows = rows.filter(e => e.actionType === filterAction)
    if (filterTeam)   rows = rows.filter(e => e.resolvedTeamIds.includes(filterTeam))
    if (search)       rows = rows.filter(e => (e.note ?? "").toLowerCase().includes(search.toLowerCase()) || getCharName(e.sourceCharacterId).toLowerCase().includes(search.toLowerCase()))
    if (maxRows)      rows = rows.slice(0, maxRows)
    return rows
  }, [pointLog, filterRole, filterAction, filterTeam, search, maxRows])

  const handleExport = () => {
    const header = "Čas,Kdo,Role,Typ,Cíl,Týmy,Body,Poznámka"
    const rows = filtered.map(e =>
      [formatDateTime(e.timestamp), getCharName(e.sourceCharacterId), e.sourceRole,
       ACTION_LABELS[e.actionType], getTargetName(e.targetType, e.targetId),
       e.resolvedTeamIds.map(getTeamName).join("|"), e.amount, e.note ?? ""].join(",")
    )
    const blob = new Blob([[header, ...rows].join("\n")], { type:"text/csv" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob)
    a.download = "akano3-log.csv"; a.click()
  }

  const filterStyle = { backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", fontSize:"0.8rem", height:32 }

  return (
    <div>
      {/* Filters */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16, alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1 1 160px" }}>
          <IconSearch size={13} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:"rgba(107,15,26,0.45)" }} />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hledat…"
            style={{ ...filterStyle, paddingLeft:28 }} />
        </div>
        <Select value={filterRole} onValueChange={(v) => setFilterRole(v ?? "")}>
          <SelectTrigger style={{ ...filterStyle, minWidth:120 }}><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Všechny role</SelectItem>
            {["gm","teacher","ruze","student"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={(v) => setFilterAction(v ?? "")}>
          <SelectTrigger style={{ ...filterStyle, minWidth:160 }}><SelectValue placeholder="Typ akce" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Všechny typy</SelectItem>
            {Object.entries(ACTION_LABELS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterTeam} onValueChange={(v) => setFilterTeam(v ?? "")}>
          <SelectTrigger style={{ ...filterStyle, minWidth:120 }}><SelectValue placeholder="Tým" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Všechny týmy</SelectItem>
            {TEAMS.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {(filterRole || filterAction || filterTeam || search) && (
          <button onClick={() => { setFilterRole(""); setFilterAction(""); setFilterTeam(""); setSearch("") }}
            style={{ background:"transparent", border:"1px solid rgba(107,15,26,0.2)", color:"rgba(107,15,26,0.45)",
              padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:"0.75rem" }}>
            <IconX size={11} style={{display:"inline",marginRight:4}} />Smazat filtry
          </button>
        )}
        {canExport && (
          <button onClick={handleExport} style={{
            marginLeft:"auto", background:"#2a8a8a22", border:"1px solid #2a8a8a60",
            color:"#2a8a8a", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:"0.8rem",
            display:"flex", alignItems:"center", gap:6,
          }}>
            <IconDownload size={13} /> Export CSV
          </button>
        )}
      </div>

      <div style={{ overflowX:"auto" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor:"#a0263330" }}>
              {["Čas","Kdo","Typ akce","Cíl","Týmy","Body","Poznámka"].map(h => (
                <TableHead key={h} style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.75rem", letterSpacing:"0.05em" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign:"center", color:"rgba(107,15,26,0.3)", padding:"32px 0" }}>
                  Žádné záznamy
                </TableCell>
              </TableRow>
            )}
            {filtered.map(e => (
              <TableRow key={e.id} style={{ borderColor:"rgba(107,15,26,0.08)" }}>
                <TableCell style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.78rem", whiteSpace:"nowrap", fontFamily:"monospace" }}>
                  {formatDateTime(e.timestamp)}
                </TableCell>
                <TableCell style={{ color:"#1a0a0a", fontSize:"0.82rem" }}>
                  {getCharName(e.sourceCharacterId)}
                  <RoleBadge role={e.sourceRole} />
                </TableCell>
                <TableCell><ActionBadge type={e.actionType} /></TableCell>
                <TableCell style={{ color:"#1a0a0a", fontSize:"0.82rem" }}>
                  {getTargetName(e.targetType, e.targetId)}
                </TableCell>
                <TableCell style={{ color:"#6b0f1a", fontSize:"0.8rem" }}>
                  {e.resolvedTeamIds.map(t => (
                    <span key={t} style={{ display:"inline-flex", alignItems:"center", marginRight:4 }}>
                      <TeamDot color={TEAMS.find(tm=>tm.id===t)?.color??"#888"} teamId={t} />
                      {getTeamName(t)}
                    </span>
                  ))}
                </TableCell>
                <TableCell style={{
                  fontWeight:700, fontFamily:"monospace",
                  color: e.amount > 0 ? "#2a8a5a" : "#e05252",
                }}>
                  {e.amount > 0 ? "+" : ""}{e.amount}
                </TableCell>
                <TableCell style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.78rem", maxWidth:200 }}>
                  {e.note ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p style={{ color:"rgba(107,15,26,0.3)", fontSize:"0.72rem", marginTop:8 }}>
        {filtered.length} záznamů
      </p>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// CHARTS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function ChartsPanel({ singleTeamId }: { singleTeamId?: string }) {
  const { teams, pointLog } = useGame()
  const [hiddenTeams, setHiddenTeams] = useState<Set<string>>(new Set())

  // Build time-series data
  const timeData = useMemo(() => {
    const buckets: Record<string, Record<string,number>> = {}
    const sortedLog = [...pointLog].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    const runningTotals: Record<string,number> = {}
    teams.forEach(t => {
      // Subtract logged points to get starting base
      const loggedSum = sortedLog.reduce((s,e) => e.resolvedTeamIds.includes(t.id) ? s + e.amount : s, 0)
      runningTotals[t.id] = t.points - loggedSum
    })
    sortedLog.forEach(e => {
      const key = formatDateTime(e.timestamp)
      e.resolvedTeamIds.forEach(tid => { runningTotals[tid] = (runningTotals[tid]??0) + e.amount })
      if (!buckets[key]) buckets[key] = { time: key as any }
      teams.forEach(t => { buckets[key][t.id] = runningTotals[t.id] ?? 0 })
    })
    return Object.values(buckets)
  }, [teams, pointLog])

  // Action type aggregates
  const barData = useMemo(() => {
    const totals: Record<string,number> = {}
    pointLog.forEach(e => { totals[e.actionType] = (totals[e.actionType]??0) + Math.abs(e.amount) })
    return Object.entries(totals).map(([k,v]) => ({ name: ACTION_LABELS[k as ActionType], value:v }))
      .sort((a,b) => b.value - a.value)
  }, [pointLog])

  const displayTeams = singleTeamId ? teams.filter(t => t.id === singleTeamId) : teams

  const chartCard = (title: string, children: React.ReactNode) => (
    <div style={{
      backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
      borderRadius:10, padding:20, marginBottom:20,
    }}>
      <p style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:16 }}>{title}</p>
      {children}
    </div>
  )

  return (
    <div>
      {chartCard("VÝVOJ BODŮ V ČASE",
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#a0263318" />
            <XAxis dataKey="time" tick={{ fill:"rgba(107,15,26,0.45)", fontSize:10 }} />
            <YAxis tick={{ fill:"rgba(107,15,26,0.45)", fontSize:10 }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a" }}
            />
            <Legend
              wrapperStyle={{ fontSize:"0.75rem", color:"#6b0f1a" }}
              onClick={e => {
                const id = displayTeams.find(t=>t.name===e.dataKey)?.id
                if (!id) return
                setHiddenTeams(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
              }}
            />
            {displayTeams.map(t => (
              <Line key={t.id} type="monotone" dataKey={t.id} name={t.name}
                stroke={t.color} strokeWidth={2} dot={false}
                hide={hiddenTeams.has(t.id)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {!singleTeamId && chartCard("PŘÍRŮSTKY DLE TYPU AKCE",
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#a0263318" horizontal={false} />
            <XAxis type="number" tick={{ fill:"rgba(107,15,26,0.45)", fontSize:10 }} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fill:"#c8a96e", fontSize:10 }} />
            <RechartsTooltip
              contentStyle={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a" }}
            />
            <Bar dataKey="value" fill="#2a8a8a" radius={[0,4,4,0]} name="Body" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// KAICHI PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function KaichiPanel({ canEdit = false }: { canEdit?: boolean }) {
  const { characters, updateKaichi } = useGame()
  const [filterTeam, setFilterTeam] = useState("")
  const [confirmId,  setConfirmId]  = useState<string|null>(null)

  const students = useMemo(() =>
    characters
      .filter(c => c.role === "student")
      .filter(c => !filterTeam || c.teamId === filterTeam)
      .sort((a,b) => b.kaichiLevel - a.kaichiLevel)
  , [characters, filterTeam])

  const confirmChar = characters.find(c => c.id === confirmId)

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
        <Select value={filterTeam} onValueChange={(v) => setFilterTeam(v ?? "")}>
          <SelectTrigger style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", maxWidth:180, height:32 }}>
            <SelectValue placeholder="Filtr — Tým" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Všechny týmy</SelectItem>
            {TEAMS.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div style={{ overflowX:"auto" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor:"#a0263330" }}>
              {["Jméno","Postava","Tým","Úroveň Kaichi", ...(canEdit ? ["Akce"] : [])].map(h => (
                <TableHead key={h} style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.75rem", letterSpacing:"0.05em" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(c => (
              <TableRow key={c.id} style={{ borderColor:"rgba(107,15,26,0.08)" }}>
                <TableCell style={{ color:"#1a0a0a", fontWeight:600 }}>{c.name}</TableCell>
                <TableCell style={{ color:"rgba(107,15,26,0.45)", fontStyle:"italic" }}>{c.nickname ?? "—"}</TableCell>
                <TableCell>
                  <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <TeamDot color={TEAMS.find(t=>t.id===c.teamId)?.color??"#888"} teamId={c.teamId} />
                    {getTeamName(c.teamId ?? "")}
                  </span>
                </TableCell>
                <TableCell><KaichiBadge level={c.kaichiLevel} /></TableCell>
                {canEdit && (
                  <TableCell>
                    <Button
                      size="sm"
                      disabled={c.kaichiLevel >= 8}
                      onClick={() => setConfirmId(c.id)}
                      style={{ backgroundColor:"#2a8a8a22", border:"1px solid #2a8a8a60",
                        color:"#2a8a8a", fontSize:"0.75rem", padding:"3px 10px" }}
                    >
                      <IconChevronUp size={12} style={{marginRight:4}} /> Povýšit
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!confirmId} onOpenChange={v => !v && setConfirmId(null)}>
        <AlertDialogContent style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Povýšit Kaichi</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              Povýšit <strong>{confirmChar?.name}</strong> na Kaichi{" "}
              <strong style={{ color:"#d4a017" }}>{romanNumeral((confirmChar?.kaichiLevel ?? 0) + 1)}</strong>?
              <br /><span style={{ fontSize:"0.8rem", color:"rgba(107,15,26,0.35)" }}>Tuto akci nelze vrátit.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if(confirmId) updateKaichi(confirmId); setConfirmId(null) }}
              style={{ backgroundColor:"#d4a01733", color:"#d4a017", border:"1px solid #d4a01760" }}>
              Potvrdit povýšení
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// MIASMA PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function MiasmaPanel({ canEdit = false }: { canEdit?: boolean }) {
  const { miasmaValue, miasmaLog, updateMiasma } = useGame()
  const [amount, setAmount] = useState(5)
  const [note,   setNote]   = useState("")

  const pct = Math.min(100, (miasmaValue / 100) * 100)
  const color = miasmaValue > 70 ? "#c0392b" : miasmaValue > 40 ? "#d4813a" : "#2a8a5a"

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:24 }}>
      <div>
        <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
          borderRadius:10, padding:24, textAlign:"center" }}>
          <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.72rem", letterSpacing:"0.1em", marginBottom:8 }}>MIASMA</p>
          <div style={{ fontSize:"4rem", fontWeight:900, fontFamily:"monospace", color, lineHeight:1, marginBottom:12 }}>
            {miasmaValue}
          </div>
          <Progress value={pct} style={{ height:8, backgroundColor:"rgba(107,15,26,0.1)" }} />
          <p style={{ color:"rgba(107,15,26,0.35)", fontSize:"0.72rem", marginTop:6 }}>{pct.toFixed(0)}% maxima</p>

          {canEdit && (
            <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <button onClick={() => setAmount(a => Math.max(1,a-1))}
                  style={{ background:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a",
                    width:32, height:32, borderRadius:6, cursor:"pointer", fontSize:"1rem" }}>−</button>
                <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                  min={1} style={{ textAlign:"center", backgroundColor:"#fff",
                    border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a", height:32 }} />
                <button onClick={() => setAmount(a => a+1)}
                  style={{ background:"#fff", border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a",
                    width:32, height:32, borderRadius:6, cursor:"pointer", fontSize:"1rem" }}>+</button>
              </div>
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Důvod…"
                style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", height:32 }} />
              <div style={{ display:"flex", gap:8 }}>
                <Button onClick={() => { updateMiasma(amount, note); setNote("") }}
                  style={{ flex:1, backgroundColor:"#c0392b22", color:"#e05252",
                    border:"1px solid #c0392b60", fontSize:"0.8rem" }}>
                  <IconPlus size={13} style={{marginRight:4}} />+{amount}
                </Button>
                <Button onClick={() => { updateMiasma(-amount, note); setNote("") }}
                  style={{ flex:1, backgroundColor:"#2a8a5a22", color:"#2a8a5a",
                    border:"1px solid #2a8a5a60", fontSize:"0.8rem" }}>
                  <IconMinus size={13} style={{marginRight:4}} />−{amount}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.72rem", letterSpacing:"0.1em", marginBottom:10 }}>LOG MIASMY</p>
        <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:320, overflowY:"auto" }}>
          {miasmaLog.length === 0 && (
            <p style={{ color:"rgba(107,15,26,0.25)", fontSize:"0.85rem", textAlign:"center", padding:24 }}>Zatím žádné záznamy</p>
          )}
          {miasmaLog.map(m => (
            <div key={m.id} style={{ display:"flex", gap:12, alignItems:"center",
              backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.08)",
              borderRadius:6, padding:"8px 12px" }}>
              <span style={{ fontFamily:"monospace", fontSize:"0.75rem", color:"rgba(107,15,26,0.45)", whiteSpace:"nowrap" }}>
                {formatDateTime(m.timestamp)}
              </span>
              <span style={{ fontWeight:700, fontFamily:"monospace",
                color: m.amount > 0 ? "#e05252" : "#2a8a5a" }}>
                {m.amount > 0 ? "+" : ""}{m.amount}
              </span>
              <span style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.82rem", flex:1 }}>{m.note || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ALARM PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function AlarmPanel() {
  const { alarmState, triggerAlarm, dismissAlarm } = useGame()
  const [confirmType,    setConfirmType]    = useState<AlarmState["type"]|null>(null)
  const [confirmMsg,     setConfirmMsg]     = useState("")
  const [customMsg,      setCustomMsg]      = useState("")

  const ALARM_TYPES: { type: AlarmState["type"]; label: string; color: string; icon: React.ElementType }[] = [
    { type:"evacuation", label:"Evakuace",    color:"#c0392b", icon:IconRun       },
    { type:"battle",     label:"Do zbraně",   color:"#d4813a", icon:IconSwords    },
    { type:"assembly",   label:"Nástup",      color:"#d4c017", icon:IconUsers     },
    { type:"custom",     label:"Vlastní",     color:"#7d1520", icon:IconAlarm     },
  ]

  return (
    <div>
      {alarmState.active ? (
        <div style={{
          backgroundColor:"#c0392b22", border:"2px solid #c0392b",
          borderRadius:12, padding:24, textAlign:"center", marginBottom:24,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12 }}>
            <IconBellRinging size={24} color="#e05252" className="alarm-pulse" />
            <span style={{ color:"#e05252", fontWeight:900, fontSize:"1.2rem", letterSpacing:"0.1em" }}>
              ALARM AKTIVNÍ
            </span>
          </div>
          <p style={{ color:"#1a0a0a", fontSize:"1rem", marginBottom:16 }}>{alarmState.message || alarmState.type.toUpperCase()}</p>
          <Button onClick={dismissAlarm} style={{
            backgroundColor:"#c0392b", color:"#fff",
            fontWeight:700, padding:"10px 32px",
          }}>
            <IconX size={16} style={{marginRight:6}} /> Zrušit alarm
          </Button>
        </div>
      ) : (
        <p style={{ color:"#2a8a5a", fontSize:"0.85rem", marginBottom:16,
          display:"flex", alignItems:"center", gap:6 }}>
          <IconCircleCheck size={16} /> Žádný alarm není aktivní
        </p>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
        {ALARM_TYPES.map(({ type, label, color, icon:Icon }) => (
          <button
            key={type}
            disabled={alarmState.active}
            onClick={() => { setConfirmType(type); setConfirmMsg(type === "custom" ? customMsg : label.toUpperCase()) }}
            style={{
              padding:"20px 16px", borderRadius:10,
              backgroundColor: color + "22",
              border: `2px solid ${color}66`,
              color, cursor: alarmState.active ? "not-allowed" : "pointer",
              opacity: alarmState.active ? 0.5 : 1,
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              transition:"all 0.2s", fontWeight:700, fontSize:"0.95rem",
            }}
          >
            <Icon size={28} />
            {label}
          </button>
        ))}
      </div>

      {confirmType === "custom" && !alarmState.active && (
        <div style={{ marginTop:16 }}>
          <Input value={customMsg} onChange={e => { setCustomMsg(e.target.value); setConfirmMsg(e.target.value) }}
            placeholder="Zpráva alarmu…"
            style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }} />
        </div>
      )}

      <AlertDialog open={!!confirmType} onOpenChange={v => !v && setConfirmType(null)}>
        <AlertDialogContent style={{ backgroundColor:"#7d1520", border:"1px solid #c0392b" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Spustit alarm?</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              Alarm <strong style={{ color:"#e05252" }}>{confirmMsg}</strong> se zobrazí na všech obrazovkách.
              <br /><span style={{ fontSize:"0.8rem" }}>Tuto akci uvidí všichni hráči.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if(confirmType) { triggerAlarm(confirmType, confirmMsg); setConfirmType(null) } }}
              style={{ backgroundColor:"#c0392b", color:"#fff" }}>
              Spustit alarm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// QR PANEL (GM only)
// ═══════════════════════════════════════════════════════════════════════════════

function QRPanel() {
  const { qrCodes, generateQR } = useGame()
  const [label,      setLabel]      = useState("")
  const [targetType, setTargetType] = useState<"team"|"unit"|"circle">("team")
  const [targetId,   setTargetId]   = useState("")
  const [points,     setPoints]     = useState(15)
  const [validity,   setValidity]   = useState<"once"|"timed"|"repeat">("once")
  const [showForm,   setShowForm]   = useState(false)

  const targetOptions = targetType === "team" ? TEAMS.map(t=>({id:t.id,label:t.name}))
    : targetType === "unit" ? UNITS.map(u=>({id:u.id,label:u.name}))
    : CIRCLES.map(c=>({id:c.id,label:c.name}))

  const handleGenerate = () => {
    if (!label || !targetId) return
    generateQR({ label, targetType, targetId, points, validity })
    setLabel(""); setTargetId(""); setShowForm(false)
  }

  const statusColor = (s: QRCode["status"]) => s==="active" ? "#2a8a5a" : s==="used" ? "#c8a96e80" : "#e05252"

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem" }}>{qrCodes.length} kódů celkem</p>
        <Button onClick={() => setShowForm(v => !v)} style={{ backgroundColor:"#2a8a8a", color:"#fff", fontSize:"0.8rem" }}>
          <IconPlus size={14} style={{marginRight:6}} /> Generovat QR
        </Button>
      </div>

      {showForm && (
        <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
          borderRadius:10, padding:20, marginBottom:20 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>POPIS / NÁZEV</Label>
              <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="např. Sklep — průzkum"
                style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }} />
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>TYP CÍLE</Label>
              <Select value={targetType} onValueChange={v => { setTargetType(v as any); setTargetId("") }}>
                <SelectTrigger style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Tým</SelectItem>
                  <SelectItem value="unit">Jednotka</SelectItem>
                  <SelectItem value="circle">Kruh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>CÍL</Label>
              <Select value={targetId} onValueChange={(v) => setTargetId(v ?? "")}>
                <SelectTrigger style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
                  <SelectValue placeholder="Vyber…" />
                </SelectTrigger>
                <SelectContent>
                  {targetOptions.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>BODY</Label>
              <Input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={1}
                style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }} />
            </div>
            <div>
              <Label style={{ color:"#6b0f1a", fontSize:"0.75rem" }}>PLATNOST</Label>
              <Select value={validity} onValueChange={v => setValidity(v as any)}>
                <SelectTrigger style={{ marginTop:4, backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Jednorázový</SelectItem>
                  <SelectItem value="timed">Časově omezený</SelectItem>
                  <SelectItem value="repeat">Opakovaný</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <Button onClick={handleGenerate} disabled={!label || !targetId}
              style={{ backgroundColor:"#2a8a8a", color:"#fff" }}>
              <IconQrcode size={14} style={{marginRight:6}} /> Vygenerovat
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}
              style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zrušit</Button>
          </div>
        </div>
      )}

      <div style={{ overflowX:"auto" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor:"#a0263330" }}>
              {["Název","Cíl","Body","Platnost","Naskenováno","Stav","Token"].map(h => (
                <TableHead key={h} style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.75rem" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {qrCodes.map(q => (
              <TableRow key={q.id} style={{ borderColor:"rgba(107,15,26,0.08)" }}>
                <TableCell style={{ color:"#1a0a0a", fontWeight:600 }}>{q.label}</TableCell>
                <TableCell style={{ color:"#6b0f1a", fontSize:"0.82rem" }}>
                  {getTargetName(q.targetType, q.targetId)}
                </TableCell>
                <TableCell style={{ color:"#d4a017", fontFamily:"monospace", fontWeight:700 }}>+{q.points}</TableCell>
                <TableCell style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem" }}>
                  {q.validity === "once" ? "Jednorázový" : q.validity === "timed" ? "Časový" : "Opakovaný"}
                </TableCell>
                <TableCell style={{ color:"#6b0f1a", fontFamily:"monospace" }}>{q.timesScanned}×</TableCell>
                <TableCell>
                  <span style={{ color:statusColor(q.status), fontSize:"0.8rem", fontWeight:600 }}>
                    {q.status === "active" ? "Aktivní" : q.status === "used" ? "Použitý" : "Expirovaný"}
                  </span>
                </TableCell>
                <TableCell style={{ color:"rgba(107,15,26,0.3)", fontFamily:"monospace", fontSize:"0.75rem" }}>{q.token}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// GAME SETUP PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function GameSetupPanel() {
  const { lessonWindowActive, lessonWindowEnd, toggleLesson } = useGame()
  const [duration, setDuration] = useState(30)
  const [timeLeft,  setTimeLeft]  = useState("")

  useEffect(() => {
    if (!lessonWindowEnd) { setTimeLeft(""); return }
    const interval = setInterval(() => {
      const diff = lessonWindowEnd.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft("Vypršelo"); clearInterval(interval); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${m}:${String(s).padStart(2,"0")}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [lessonWindowEnd])

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)",
      borderRadius:10, padding:20, marginBottom:16 }}>
      <p style={{ color:"#6b0f1a", fontSize:"0.75rem", letterSpacing:"0.1em", marginBottom:14 }}>{title}</p>
      {children}
    </div>
  )

  return (
    <div style={{ maxWidth:600 }}>
      {section("OKNO PRO BODY ZA HODINU",
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <Switch checked={lessonWindowActive} onCheckedChange={v => toggleLesson(v, duration)} />
            <span style={{ color:"#1a0a0a", fontSize:"0.9rem" }}>
              {lessonWindowActive ? "Okno je AKTIVNÍ" : "Okno je zavřeno"}
            </span>
            {lessonWindowActive && timeLeft && (
              <span style={{ backgroundColor:"#2a8a8a22", color:"#2a8a8a", border:"1px solid #2a8a8a60",
                padding:"2px 10px", borderRadius:20, fontFamily:"monospace", fontSize:"0.85rem", fontWeight:700 }}>
                <IconClock size={12} style={{display:"inline",marginRight:4}} />{timeLeft}
              </span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Label style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem", minWidth:80 }}>Délka (min)</Label>
            <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))}
              min={5} max={120} style={{ width:80, backgroundColor:"#fff",
                border:"1px solid rgba(107,15,26,0.2)", color:"#1a0a0a" }} />
          </div>
        </div>
      )}

      {section("SESTAVENÍ HRY",
        <div style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.85rem", lineHeight:1.6 }}>
          <p>• Jednotky: {UNITS.map(u => `${u.name} (${u.teamIds.map(getTeamName).join(" + ")})`).join(", ")}</p>
          <p style={{marginTop:8}}>• Kruhy: {CIRCLES.map(c => c.name).join(", ")}</p>
          <p style={{marginTop:8, color:"rgba(107,15,26,0.3)", fontSize:"0.75rem"}}>
            Přiřazení jednotek a kruhů lze editovat v plné verzi.
          </p>
        </div>
      )}

      {section("POOL BODŮ PRO STUDENTY",
        <div style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.85rem" }}>
          <p>Výchozí pool: <strong style={{color:"#1a0a0a"}}>20 bodů</strong> na hráče</p>
          <p style={{marginTop:6, color:"rgba(107,15,26,0.3)", fontSize:"0.75rem"}}>Ruční doplnění poolu — k dispozici v plné verzi.</p>
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// GM DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

function GMDashboard() {
  const { teams, pointLog, miasmaValue, alarmState, qrCodes } = useGame()
  const [sbMode, setSbMode] = useState<"teams"|"units"|"circles">("teams")
  const [sheetOpen, setSheetOpen] = useState(false)

  const sorted    = [...teams].sort((a,b) => b.points - a.points)
  const leader    = sorted[0]
  const totalPts  = teams.reduce((s,t) => s+t.points, 0)
  const activeQRs = qrCodes.filter(q => q.status === "active").length

  const statCard = (icon: React.ElementType, label: string, value: string|number, accent?: string) => {
    const Icon = icon
    return (
      <div style={{
        backgroundColor:"#c8a96e", borderRadius:10, padding:"16px 20px",
        display:"flex", alignItems:"center", gap:14,
        boxShadow:"0 2px 12px rgba(0,0,0,0.3)",
      }}>
        <div style={{ backgroundColor: (accent ?? "#3a1a0a") + "22",
          padding:10, borderRadius:8, color: accent ?? "#3a1a0a" }}>
          <Icon size={22} />
        </div>
        <div>
          <p style={{ color:"#6a3a1a", fontSize:"0.72rem", letterSpacing:"0.08em", marginBottom:2 }}>{label}</p>
          <p style={{ color:"#3a1a0a", fontWeight:900, fontSize:"1.3rem", fontFamily:"monospace", lineHeight:1 }}>{value}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Quick-add sheet trigger */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 className="font-cinzel" style={{ color:"#1a0a0a", fontSize:"1.5rem", fontWeight:700, letterSpacing:"0.1em" }}>
          Velitelský přehled
        </h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={<button />}
            style={{ backgroundColor:"#2a8a8a", color:"#fff", fontWeight:700,
              padding:"8px 16px", borderRadius:6, border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:6, fontSize:"0.875rem" }}
          >
            <IconPlus size={16} /> Zadat body
          </SheetTrigger>
          <SheetContent style={{ backgroundColor:"#faf7f2", borderLeft:"1px solid rgba(107,15,26,0.15)", minWidth:380 }}>
            <SheetHeader>
              <SheetTitle style={{ color:"#1a0a0a", fontFamily:"Cinzel,serif" }}>Zadat body</SheetTitle>
            </SheetHeader>
            <div style={{ marginTop:20 }}>
              <PointAssignmentForm onClose={() => setSheetOpen(false)} canCorrect />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="overview">
        <TabsList style={{ backgroundColor:"rgba(107,15,26,0.05)", border:"1px solid rgba(107,15,26,0.1)",
          marginBottom:20, flexWrap:"wrap", height:"auto", gap:2 }}>
          {[
            ["overview","Přehled",IconDashboard],
            ["points","Zadávání bodů",IconPlus],
            ["log","Log",IconList],
            ["charts","Grafy",IconChartLine],
            ["kaichi","Kaichi",IconStar],
            ["qr","QR kódy",IconQrcode],
            ["alarm","Alarm",IconBell],
            ["settings","Nastavení",IconSettings],
          ].map(([v,label,Icon]) => (
            <TabsTrigger key={v as string} value={v as string}
              style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem",
                display:"flex", alignItems:"center", gap:5 }}>
              {React.createElement(Icon as React.ElementType, {size:13})}
              {label as string}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:24 }}>
            {statCard(IconTrophy,  "Vedoucí tým",    leader?.name ?? "—")}
            {statCard(IconQrcode,  "Aktivní QR",      activeQRs,          "#d4a017")}
            {statCard(IconBell,    "Alarm",           alarmState.active ? "AKTIVNÍ" : "Klid", alarmState.active ? "#c0392b" : "#2a8a5a")}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)", borderRadius:10, padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <p style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.08em" }}>ŽEBŘÍČEK TÝMŮ</p>
              </div>
              <ScoreboardComponent mode={sbMode} compact showModeToggle onModeChange={setSbMode} />
            </div>
            <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)", borderRadius:10, padding:20 }}>
              <p style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:12 }}>POSLEDNÍCH 5 AKCÍ</p>
              <TransactionLog maxRows={5} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="points">
          <div style={{ maxWidth:520 }}>
            <PointAssignmentForm canCorrect />
          </div>
        </TabsContent>

        <TabsContent value="log">
          <TransactionLog canExport />
        </TabsContent>

        <TabsContent value="charts">
          <ChartsPanel />
        </TabsContent>

        <TabsContent value="kaichi">
          <KaichiPanel canEdit />
        </TabsContent>

        <TabsContent value="qr">
          <QRPanel />
        </TabsContent>

        <TabsContent value="alarm">
          <AlarmPanel />
        </TabsContent>

        <TabsContent value="settings">
          <GameSetupPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// TEACHER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

function TeacherDashboard() {
  const { teams, pointLog } = useGame()
  const [sheetOpen, setSheetOpen] = useState(false)
  const sorted = [...teams].sort((a,b) => b.points - a.points)

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 className="font-cinzel" style={{ color:"#1a0a0a", fontSize:"1.5rem", fontWeight:700, letterSpacing:"0.1em" }}>
          Učitelský přehled
        </h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={<button />}
            style={{ backgroundColor:"#2a8a8a", color:"#fff", fontWeight:700,
              padding:"8px 16px", borderRadius:6, border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:6, fontSize:"0.875rem" }}
          >
            <IconPlus size={16} /> Zadat body
          </SheetTrigger>
          <SheetContent style={{ backgroundColor:"#faf7f2", borderLeft:"1px solid rgba(107,15,26,0.15)", minWidth:380 }}>
            <SheetHeader>
              <SheetTitle style={{ color:"#1a0a0a", fontFamily:"Cinzel,serif" }}>Zadat body</SheetTitle>
            </SheetHeader>
            <div style={{ marginTop:20 }}>
              <PointAssignmentForm onClose={() => setSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="overview">
        <TabsList style={{ backgroundColor:"rgba(107,15,26,0.05)", border:"1px solid rgba(107,15,26,0.1)", marginBottom:20 }}>
          {[["overview","Přehled",IconDashboard],["points","Body",IconPlus],["log","Log",IconList],
            ["charts","Grafy",IconChartLine],["kaichi","Kaichi",IconStar],
            ["alarm","Alarm",IconBell]
          ].map(([v,label,Icon]) => (
            <TabsTrigger key={v as string} value={v as string}
              style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.8rem", display:"flex", alignItems:"center", gap:5 }}>
              {React.createElement(Icon as React.ElementType, {size:13})}
              {label as string}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)", borderRadius:10, padding:20 }}>
              <p style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:12 }}>ŽEBŘÍČEK TÝMŮ</p>
              <ScoreboardComponent compact />
            </div>
            <div style={{ backgroundColor:"rgba(107,15,26,0.03)", border:"1px solid rgba(107,15,26,0.1)", borderRadius:10, padding:20 }}>
              <p style={{ color:"#6b0f1a", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:12 }}>POSLEDNÍ AKCE</p>
              <TransactionLog maxRows={8} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="points"><div style={{maxWidth:520}}><PointAssignmentForm /></div></TabsContent>
        <TabsContent value="log"><TransactionLog /></TabsContent>
        <TabsContent value="charts"><ChartsPanel /></TabsContent>
        <TabsContent value="kaichi"><KaichiPanel /></TabsContent>
        <TabsContent value="alarm"><AlarmPanel /></TabsContent>
      </Tabs>
    </div>
  )
}

// Růže = same as Teacher
function RuzeDashboard() { return <TeacherDashboard /> }


// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

function StudentDashboard() {
  const { currentUser, characters, teams, lessonWindowActive, lessonWindowEnd, claimLesson, giftPoints } = useGame()
  const student  = characters.find(c => c.id === currentUser?.id)
  const team     = teams.find(t => t.id === student?.teamId)
  const teamRank = [...teams].sort((a,b)=>b.points-a.points).findIndex(t=>t.id===student?.teamId) + 1

  const [giftTarget,   setGiftTarget]   = useState("")
  const [giftAmount,   setGiftAmount]   = useState(5)
  const [giftConfirm,  setGiftConfirm]  = useState(false)
  const [lessonConfirm,setLessonConfirm]= useState(false)

  const teammates     = characters.filter(c => c.role === "student" && c.id !== student?.id)
  const giftTargetChar= characters.find(c => c.id === giftTarget)

  const [lessonCountdown, setLessonCountdown] = useState("")
  useEffect(() => {
    if (!lessonWindowEnd) return
    const iv = setInterval(() => {
      const diff = lessonWindowEnd.getTime() - Date.now()
      if (diff <= 0) { setLessonCountdown("Vypršelo"); clearInterval(iv); return }
      const m = Math.floor(diff / 60000), s = Math.floor((diff % 60000) / 1000)
      setLessonCountdown(`${m}:${String(s).padStart(2,"0")}`)
    }, 1000)
    return () => clearInterval(iv)
  }, [lessonWindowEnd])

  if (!student) return null

  const specColors: Record<string,string> = { combat:"#e05252", tactical:"#5268e0", support:"#52d4b4" }
  const specColor  = student.specialization ? specColors[student.specialization] : null
  const inputStyle = { backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)", height:48, fontSize:"0.95rem" }

  return (
    <div style={{ maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column", minHeight:"100dvh" }}>

      {/* ── Sticky character header ── */}
      <div style={{
        position:"sticky", top:0, zIndex:20,
        backgroundColor:"#faf7f2",
        borderBottom:"1px solid rgba(107,15,26,0.12)",
        padding:"16px 20px 14px",
      }}>
        {/* Spec ribbon + name + Kaichi + points */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
          {specColor && (
            <div style={{ width:4, minHeight:48, borderRadius:2, backgroundColor:specColor, flexShrink:0, alignSelf:"stretch" }} />
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"#1a0a0a", lineHeight:1.15, margin:0 }}>
                {student?.name}
              </h1>
              {(student?.kaichiLevel ?? 0) > 0 && (
                <div style={{
                  width:30, height:30, borderRadius:"50%",
                  border:"2px solid #d4a017", backgroundColor:"#1a0a00",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.75rem", color:"#d4a017", fontFamily:"monospace", fontWeight:700,
                  flexShrink:0, letterSpacing:"0.02em",
                }}>
                  {romanNumeral(student.kaichiLevel)}
                </div>
              )}
            </div>
            {student?.nickname && (
              <p style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.85rem", fontStyle:"italic", margin:"2px 0 6px" }}>
                „{student.nickname}"
              </p>
            )}
            {/* Team / unit / circle row */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginTop:4 }}>
              {team && (
                <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <TeamIcon teamId={team.id} size={15} />
                  <span style={{ fontSize:"0.82rem", fontWeight:600, color:"#1a0a0a" }}>{team.name}</span>
                  <span style={{ fontSize:"0.75rem", color:"rgba(107,15,26,0.4)" }}>#{teamRank}</span>
                </span>
              )}
              {student?.unitId && (
                <span style={{ fontSize:"0.78rem", color:"rgba(107,15,26,0.5)", borderLeft:"1px solid rgba(107,15,26,0.15)", paddingLeft:10 }}>
                  {getUnitName(student.unitId)}
                </span>
              )}
              {(student?.circleIds ?? []).length > 0 && (
                <span style={{ fontSize:"0.78rem", color:"rgba(107,15,26,0.5)", borderLeft:"1px solid rgba(107,15,26,0.15)", paddingLeft:10 }}>
                  {(student.circleIds ?? []).map(getCircleName).join(" · ")}
                </span>
              )}
            </div>
          </div>
          {/* Team points */}
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <p style={{ fontSize:"0.62rem", color:"rgba(107,15,26,0.4)", letterSpacing:"0.09em", marginBottom:2 }}>BODY TÝMU</p>
            <p style={{ fontSize:"2rem", fontWeight:900, fontFamily:"monospace", color:"#6b0f1a", lineHeight:1 }}>
              {team?.points ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="scoreboard" style={{ flex:1, display:"flex", flexDirection:"column" }}>
        {/* Tab bar — mobile-sized, icons + labels stacked */}
        <TabsList style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          backgroundColor:"#fff",
          borderBottom:"1px solid rgba(107,15,26,0.1)",
          borderRadius:0, padding:0, height:"auto",
        }}>
          {([
            ["scoreboard","Žebříček", IconTrophy],
            ["myteam",    "Tým",      IconUsers],
            ["actions",   "Akce",     IconTarget],
            ["chart",     "Graf",     IconChartLine],
          ] as [string,string,React.ElementType][]).map(([v, label, Icon]) => (
            <TabsTrigger
              key={v}
              value={v}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:4, padding:"12px 4px 10px", minHeight:60,
                fontSize:"0.72rem", fontWeight:600, borderRadius:0,
                color:"rgba(107,15,26,0.4)",
              }}
            >
              <Icon size={22} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div style={{ padding:"20px 16px 32px" }}>

          {/* ── ŽEBŘÍČEK ── */}
          <TabsContent value="scoreboard">
            <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"rgba(107,15,26,0.4)", marginBottom:14 }}>AKTUÁLNÍ ŽEBŘÍČEK</p>
            <ScoreboardComponent highlightId={student?.teamId} />
          </TabsContent>

          {/* ── TÝM ── */}
          <TabsContent value="myteam">
            <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"rgba(107,15,26,0.4)", marginBottom:14 }}>ČLENOVÉ TÝMU</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {CHARACTERS.filter(c => c.teamId === student?.teamId && c.role === "student").map(c => (
                <div key={c.id} style={{
                  display:"flex", alignItems:"center", gap:14,
                  backgroundColor:"#fff", borderRadius:14, padding:"14px 16px",
                  border: c.id === student?.id
                    ? "1.5px solid rgba(42,138,138,0.45)"
                    : "1px solid rgba(107,15,26,0.1)",
                  boxShadow: c.id === student?.id ? "0 0 0 3px rgba(42,138,138,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <div style={{
                    width:44, height:44, borderRadius:"50%",
                    backgroundColor:"rgba(107,15,26,0.06)",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}>
                    <IconUser size={22} color="rgba(107,15,26,0.3)" />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:700, fontSize:"1rem", color:"#1a0a0a" }}>{c.name}</span>
                      {c.id === student?.id && (
                        <span style={{ fontSize:"0.68rem", color:"#2a8a8a", backgroundColor:"rgba(42,138,138,0.1)", padding:"1px 7px", borderRadius:20 }}>ty</span>
                      )}
                    </div>
                    {c.nickname && (
                      <p style={{ color:"rgba(107,15,26,0.4)", fontSize:"0.78rem", fontStyle:"italic", margin:0 }}>„{c.nickname}"</p>
                    )}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
                    <SpecBadge spec={c.specialization} />
                    <KaichiBadge level={c.kaichiLevel} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── AKCE ── */}
          <TabsContent value="actions">
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Lesson points card */}
              <div style={{ backgroundColor:"#fff", borderRadius:16, padding:"20px 18px", border:"1px solid rgba(107,15,26,0.1)", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"rgba(107,15,26,0.4)", marginBottom:6 }}>BODY ZA HODINU</p>
                <p style={{ color:"rgba(107,15,26,0.5)", fontSize:"0.85rem", lineHeight:1.5, marginBottom:16 }}>
                  Každé aktivní okno lze využít jednou. Přidá 5 bodů tvému týmu.
                </p>
                {lessonWindowActive && lessonCountdown && (
                  <p style={{ color:"#2a8a8a", fontSize:"0.85rem", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                    <IconClock size={15} /> Okno zavírá za {lessonCountdown}
                  </p>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger render={<span />} style={{ display:"block" }}>
                      <Button
                        disabled={!lessonWindowActive || student?.lessonClaimedThisWindow}
                        onClick={() => setLessonConfirm(true)}
                        style={{
                          width:"100%", height:52, fontSize:"1rem", fontWeight:700, borderRadius:12,
                          backgroundColor: lessonWindowActive && !student?.lessonClaimedThisWindow ? "#2a8a8a" : "rgba(107,15,26,0.06)",
                          color: lessonWindowActive && !student?.lessonClaimedThisWindow ? "#fff" : "rgba(107,15,26,0.3)",
                          pointerEvents: (!lessonWindowActive || student?.lessonClaimedThisWindow) ? "none" : "auto",
                        }}
                      >
                        {student?.lessonClaimedThisWindow
                          ? <><IconCircleCheck size={18} style={{marginRight:8}} />Již uplatněno</>
                          : <><IconBook size={18} style={{marginRight:8}} />Uplatnit body za hodinu (+5)</>
                        }
                      </Button>
                    </TooltipTrigger>
                    {!lessonWindowActive && (
                      <TooltipContent>Okno pro body za hodinu není aktivní</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Gift points card */}
              <div style={{ backgroundColor:"#fff", borderRadius:16, padding:"20px 18px", border:"1px solid rgba(107,15,26,0.1)", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"rgba(107,15,26,0.4)" }}>DAROVAT BODY</p>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:"0.65rem", color:"rgba(107,15,26,0.4)" }}>Zbývá ti</p>
                    <p style={{ fontFamily:"monospace", fontWeight:900, fontSize:"1.3rem", lineHeight:1,
                      color:(student?.peerPointPool ?? 0) > 0 ? "#2a8a8a" : "#e05252" }}>
                      {student?.peerPointPool ?? 0}
                    </p>
                  </div>
                </div>
                <Progress value={((student?.peerPointPool ?? 0) / 20) * 100}
                  style={{ height:5, marginBottom:16, backgroundColor:"rgba(107,15,26,0.08)" }} />
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <Select value={giftTarget} onValueChange={(v) => setGiftTarget(v ?? "")}>
                    <SelectTrigger style={inputStyle}><SelectValue placeholder="Vyber spolužáka…" /></SelectTrigger>
                    <SelectContent>
                      {teammates.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} — {getTeamName(c.teamId ?? "")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <Input type="number" value={giftAmount}
                      onChange={e => setGiftAmount(Math.min(student?.peerPointPool ?? 0, Math.max(1, Number(e.target.value))))}
                      min={1} max={student?.peerPointPool ?? 0}
                      style={{ ...inputStyle, width:110 }} />
                    <span style={{ color:"rgba(107,15,26,0.45)", fontSize:"0.85rem" }}>
                      max {student?.peerPointPool ?? 0} bodů
                    </span>
                  </div>
                  <Button
                    disabled={!giftTarget || giftAmount <= 0 || (student?.peerPointPool ?? 0) <= 0}
                    onClick={() => setGiftConfirm(true)}
                    style={{ backgroundColor:"#6b0f1a", color:"#fff", height:52, fontSize:"1rem", fontWeight:700, borderRadius:12 }}
                  >
                    Darovat {giftAmount} {giftAmount === 1 ? "bod" : giftAmount < 5 ? "body" : "bodů"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── GRAF ── */}
          <TabsContent value="chart">
            <p style={{ fontSize:"0.72rem", letterSpacing:"0.09em", color:"rgba(107,15,26,0.4)", marginBottom:16 }}>VÝVOJ BODŮ TÝMU</p>
            <ChartsPanel singleTeamId={student?.teamId} />
          </TabsContent>

        </div>
      </Tabs>

      {/* Lesson confirm */}
      <AlertDialog open={lessonConfirm} onOpenChange={setLessonConfirm}>
        <AlertDialogContent style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Potvrdit body za hodinu</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              Získáš <strong style={{color:"#2a8a8a"}}>+5 bodů</strong> pro tým <strong>{team?.name}</strong>.
              V tomto okně lze uplatnit pouze jednou.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (student) { claimLesson(student.id); setLessonConfirm(false) } }}
              style={{ backgroundColor:"#2a8a8a", color:"#fff" }}>Potvrdit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Gift confirm */}
      <AlertDialog open={giftConfirm} onOpenChange={setGiftConfirm}>
        <AlertDialogContent style={{ backgroundColor:"#fff", border:"1px solid rgba(107,15,26,0.2)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color:"#1a0a0a" }}>Darovat body</AlertDialogTitle>
            <AlertDialogDescription style={{ color:"#6b0f1a" }}>
              Darovat <strong style={{color:"#2a8a8a"}}>{giftAmount} bodů</strong> hráči{" "}
              <strong>{giftTargetChar?.name}</strong> ({getTeamName(giftTargetChar?.teamId ?? "")})?
              <br />Ze svého poolu zbyde <strong>{(student?.peerPointPool ?? 0) - giftAmount} bodů</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderColor:"rgba(107,15,26,0.2)", color:"#6b0f1a" }}>Zpět</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (student) giftPoints(student.id, giftTarget, giftAmount)
              setGiftTarget(""); setGiftConfirm(false)
            }} style={{ backgroundColor:"#6b0f1a", color:"#fff" }}>
              Darovat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function DisplayScreen() {
  const { teams, pointLog, alarmState, broadcastActive } = useGame()
  const [tick,    setTick]    = useState(0)
  const [view,    setView]    = useState<"scores"|"chart">("scores")
  const ROTATE_MS = 18000 // switch view every 18 s

  // REALTIME_HOOK: replace setInterval with WebSocket subscription
  useEffect(() => {
    const clock = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(clock)
  }, [])

  // Auto-rotate between scoreboard and chart
  useEffect(() => {
    const iv = setInterval(() => setView(v => v === "scores" ? "chart" : "scores"), ROTATE_MS)
    return () => clearInterval(iv)
  }, [])

  const sorted = useMemo(() => [...teams].sort((a,b) => b.points - a.points), [teams])

  // Build time-series for chart (same logic as ChartsPanel)
  const timeData = useMemo(() => {
    const sortedLog = [...pointLog].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    const runningTotals: Record<string,number> = {}
    teams.forEach(t => {
      const loggedSum = sortedLog.reduce((s,e) => e.resolvedTeamIds.includes(t.id) ? s + e.amount : s, 0)
      runningTotals[t.id] = t.points - loggedSum
    })
    const buckets: Record<string,Record<string,number>> = {}
    sortedLog.forEach(e => {
      e.resolvedTeamIds.forEach(tid => { runningTotals[tid] = (runningTotals[tid]??0) + e.amount })
      const key = formatDateTime(e.timestamp)
      if (!buckets[key]) buckets[key] = { time: key as any }
      teams.forEach(t => { buckets[key][t.id] = runningTotals[t.id] ?? 0 })
    })
    return Object.values(buckets)
  }, [teams, pointLog])

  if (alarmState.active) {
    return (
      <div className="alarm-overlay" style={{
        position:"fixed", inset:0, zIndex:9999,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        backgroundColor: alarmState.color,
      }}>
        <IconBellRinging size={80} color="white" style={{ marginBottom:32 }} className="alarm-pulse" />
        <h1 className="alarm-flash-text font-cinzel" style={{
          color:"#fff", fontSize:"clamp(2rem,8vw,6rem)", fontWeight:900,
          textAlign:"center", padding:"0 40px", letterSpacing:"0.1em",
          textShadow:"0 0 40px rgba(0,0,0,0.5)",
        }}>
          {alarmState.message || alarmState.type.toUpperCase()}
        </h1>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"1.2rem", marginTop:24, letterSpacing:"0.2em" }}>
          AKANO3 · ALARM SYSTÉM
        </p>
      </div>
    )
  }

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"radial-gradient(ellipse at 50% 0%, #8c1f2a 0%, #6b0f1a 50%, #3a0810 100%)",
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
      {broadcastActive && (
        <div style={{
          backgroundColor:"#2a8a8a33", borderBottom:"1px solid #2a8a8a60",
          padding:"6px 24px", textAlign:"right",
          color:"#2a8a8a", fontSize:"0.8rem", fontWeight:600,
        }}>
          <IconVolume size={13} style={{display:"inline",marginRight:6}} />
          ŽIVÉ VYSÍLÁNÍ
        </div>
      )}

      {/* Title + view label */}
      <div style={{ textAlign:"center", padding:"20px 0 10px", flexShrink:0 }}>
        <h1 className="font-cinzel" style={{
          color:"#c8a96e", fontSize:"clamp(1rem,3vw,2rem)", fontWeight:900,
          letterSpacing:"0.3em", opacity:0.45, margin:0,
        }}>
          AKANO<span style={{ color:"#2a8a8a" }}>3</span>
        </h1>
        <p style={{
          color:"rgba(200,169,110,0.35)", fontSize:"clamp(0.6rem,1.2vw,0.8rem)",
          letterSpacing:"0.25em", marginTop:4,
        }}>
          {view === "scores" ? "ŽEBŘÍČEK" : "VÝVOJ V ČASE"}
        </p>
      </div>

      {/* Main content — animates between views */}
      <div style={{ flex:1, overflow:"hidden", padding:"0 32px 8px", display:"flex", flexDirection:"column" }}>

        {/* SCOREBOARD VIEW */}
        {view === "scores" && (
          <div style={{ flex:1, overflowY:"auto" }}>
            <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexDirection:"column", gap:8 }}>
              {sorted.map((team, i) => (
                <div key={team.id} style={{
                  display:"flex", alignItems:"center", gap:20,
                  padding:"clamp(8px,1.5vh,18px) 28px",
                  backgroundColor: i === 0 ? "rgba(212,160,23,0.1)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${i === 0 ? "rgba(212,160,23,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius:10, transition:"all 0.5s ease",
                }}>
                  <span style={{
                    minWidth:"3ch", fontFamily:"monospace", fontWeight:900,
                    fontSize:"clamp(1.2rem,2.5vw,2.2rem)",
                    color: i === 0 ? "#d4a017" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "rgba(200,169,110,0.35)",
                  }}>{i + 1}</span>
                  <TeamIcon teamId={team.id} size={28} strokeWidth={1.5} />
                  <span style={{
                    flex:1, fontFamily:"'Cinzel', serif",
                    fontSize:"clamp(1rem,2.2vw,2rem)",
                    fontWeight:700, color:"#e8d5b0", letterSpacing:"0.05em",
                  }}>{team.name}</span>
                  <span style={{
                    fontFamily:"monospace", fontWeight:900,
                    fontSize:"clamp(1.2rem,3vw,2.5rem)",
                    color:"#c8a96e", letterSpacing:"0.05em",
                  }}>{team.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHART VIEW */}
        {view === "chart" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:1100, margin:"0 auto", width:"100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top:10, right:30, bottom:10, left:10 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.07)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill:"rgba(200,169,110,0.5)", fontSize:"clamp(8px,1vw,12px)" }}
                  tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.1)" }}
                />
                <YAxis
                  tick={{ fill:"rgba(200,169,110,0.5)", fontSize:"clamp(8px,1vw,12px)" }}
                  tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.1)" }}
                  width={45}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor:"rgba(30,5,10,0.95)", border:"1px solid rgba(200,169,110,0.3)", color:"#e8d5b0", borderRadius:6 }}
                  labelStyle={{ color:"rgba(200,169,110,0.7)", fontSize:"0.75rem" }}
                />
                <Legend
                  wrapperStyle={{ color:"rgba(200,169,110,0.7)", fontSize:"clamp(9px,1vw,13px)", paddingTop:8 }}
                />
                {sorted.map(t => (
                  <Line
                    key={t.id} type="monotone" dataKey={t.id} name={t.name}
                    stroke={t.color} strokeWidth={3} dot={false}
                    activeDot={{ r:5, fill:t.color }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer ticker + view dots */}
      <div style={{
        borderTop:"1px solid rgba(255,255,255,0.08)",
        padding:"8px 24px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexShrink:0,
      }}>
        <span style={{ color:"rgba(200,169,110,0.4)", fontSize:"0.75rem", letterSpacing:"0.15em" }}>
          AKANO3 · SCOREBOARD
        </span>
        {/* View indicators */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {(["scores","chart"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              width:8, height:8, borderRadius:"50%", border:"none", cursor:"pointer", padding:0,
              backgroundColor: view === v ? "rgba(200,169,110,0.8)" : "rgba(200,169,110,0.2)",
              transition:"background 0.3s",
            }} />
          ))}
        </div>
        <span style={{ color:"rgba(200,169,110,0.5)", fontSize:"0.8rem", fontFamily:"monospace" }}>
          {new Date().toLocaleTimeString("cs-CZ")}
        </span>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

function Router() {
  const { currentUser, currentScreen, alarmState } = useGame()

  if (currentScreen === "login" || !currentUser) return <LoginScreen />
  if (currentScreen === "display") return <DisplayScreen />

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#faf7f2", color:"#1a0a0a" }}>
      <AlarmBannerStrip />
      <TopBar showBroadcast={["gm","teacher","ruze"].includes(currentUser.role)} />
      {currentScreen === "student" ? (
        <>
          <StudentDashboard />
          <ToastContainer />
        </>
      ) : (
        <>
          <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px 16px" }}>
            {currentScreen === "gm"      && <GMDashboard />}
            {currentScreen === "teacher" && <TeacherDashboard />}
            {currentScreen === "ruze"    && <RuzeDashboard />}
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY
// ═══════════════════════════════════════════════════════════════════════════════

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
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backgroundColor:"#faf7f2", color:"#6b0f1a", gap:16, padding:32 }}>
          <p style={{ fontWeight:700, fontSize:"1.1rem" }}>Nastala neočekávaná chyba</p>
          <pre style={{ fontSize:"0.75rem", opacity:0.6, maxWidth:480, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
            {this.state.error.message}
          </pre>
          <button onClick={() => this.setState({ error: null })} style={{ padding:"8px 20px", backgroundColor:"#6b0f1a", color:"#fff", border:"none", borderRadius:6, cursor:"pointer" }}>
            Zkusit znovu
          </button>
        </div>
      )
    }
    return this.props.children
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AkanoApp() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <GameProvider>
          <GlobalStyles />
          <Router />
        </GameProvider>
      </TooltipProvider>
    </ErrorBoundary>
  )
}
