"use client"

import React, { useState, useMemo } from "react"
import {
  IconPlus, IconDashboard, IconList, IconChartLine, IconStar,
  IconQrcode, IconBell, IconSettings, IconTrophy, IconRepeat, IconBook,
} from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useGame } from "@/lib/game-context"
import { ScoreboardComponent } from "@/components/panels/scoreboard"
import { PointAssignmentForm } from "@/components/panels/point-assignment"
import { TransactionLog } from "@/components/panels/transaction-log"
import { ChartsPanel } from "@/components/panels/charts"
import { KaichiPanel } from "@/components/panels/kaichi"
import { AlarmPanel } from "@/components/panels/alarm"
import { QRPanel } from "@/components/panels/qr"
import { GameSetupPanel } from "@/components/panels/game-setup"
import { RunSetupPanel } from "@/components/panels/run-setup"
import { WikiAdminPanel } from "@/components/panels/wiki-admin"

export function GMDashboard() {
  const { teams, alarmState, qrCodes, runs, activeRunId, setActiveRun } = useGame()
  const [sbMode,    setSbMode]    = useState<"students" | "teams" | "units" | "circles">("teams")
  const [sheetOpen, setSheetOpen] = useState(false)

  const sorted    = useMemo(() => [...teams].sort((a,b) => b.points - a.points), [teams])
  const leader    = sorted[0]
  const activeQRs = useMemo(() => qrCodes.filter(q => q.status === "active").length, [qrCodes])
  const activeRun = useMemo(() => runs.find(r => r.id === activeRunId), [runs, activeRunId])

  const statCard = (icon: React.ElementType, label: string, value: string | number, accent?: string) => {
    const Icon = icon
    const color = accent ?? "#6b0f1a"
    return (
      <div style={{
        backgroundColor:"var(--c-bg-card)", borderRadius:10, padding:"16px 20px",
        display:"flex", alignItems:"center", gap:14,
        border:"1px solid var(--c-border)",
        boxShadow:"0 1px 4px rgba(0,0,0,0.08)",
      }}>
        <div style={{ backgroundColor: color + "18", padding:10, borderRadius:8, color }}>
          <Icon size={22} />
        </div>
        <div>
          <p style={{ color:"var(--c-text-muted)", fontSize:"0.72rem", letterSpacing:"0.08em", marginBottom:2 }}>{label}</p>
          <p style={{ color:"var(--c-text)", fontWeight:900, fontSize:"1.3rem", fontFamily:"monospace", lineHeight:1 }}>{value}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <h1 style={{ color:"var(--c-text)", fontSize:"1.5rem", fontWeight:700 }}>
            Velitelský přehled
          </h1>
          {runs.length > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <select
                value={activeRunId ?? ""}
                onChange={e => setActiveRun(Number(e.target.value))}
                style={{
                  backgroundColor:"var(--c-bg-card)", border:"1px solid var(--c-border)",
                  borderRadius:6, color:"var(--c-text)", fontSize:"0.85rem",
                  padding:"5px 10px", cursor:"pointer",
                }}
              >
                {runs.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {activeRun && (
                <span style={{
                  backgroundColor:"rgba(42,138,90,0.15)", color:"#2a8a5a",
                  border:"1px solid rgba(42,138,90,0.3)", fontSize:"0.72rem",
                  padding:"3px 10px", borderRadius:20, fontWeight:700,
                }}>
                  AKTIVNÍ
                </span>
              )}
            </div>
          )}
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={<button />}
            style={{ backgroundColor:"#2a8a8a", color:"#fff", fontWeight:700,
              padding:"8px 16px", borderRadius:6, border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:6, fontSize:"0.875rem" }}
          >
            <IconPlus size={16} /> Zadat body
          </SheetTrigger>
          <SheetContent style={{ backgroundColor:"var(--c-bg)", borderLeft:"1px solid var(--c-border)", minWidth:380 }}>
            <SheetHeader>
              <SheetTitle style={{ color:"var(--c-text)" }}>Zadat body</SheetTitle>
            </SheetHeader>
            <div style={{ marginTop:20 }}>
              <PointAssignmentForm onClose={() => setSheetOpen(false)} canCorrect />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="overview">
        <TabsList style={{ backgroundColor:"var(--c-bg-section)", border:"1px solid var(--c-border)",
          marginBottom:20, flexWrap:"wrap", height:"auto", gap:2 }}>
          {[
            ["overview","Přehled",IconDashboard],
            ["points","Zadávání bodů",IconPlus],
            ["log","Log",IconList],
            ["charts","Grafy",IconChartLine],
            ["kaichi","Kaichi",IconStar],
            ["qr","QR kódy",IconQrcode],
            ["alarm","Alarm",IconBell],
            ["runs","Běhy",IconRepeat],
            ["wiki","Wiki",IconBook],
            ["settings","Nastavení",IconSettings],
          ].map(([v,label,Icon]) => (
            <TabsTrigger key={v as string} value={v as string}
              style={{ color:"var(--c-text-muted)", fontSize:"0.8rem", display:"flex", alignItems:"center", gap:5 }}>
              {React.createElement(Icon as React.ElementType, {size:13})}
              {label as string}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:24 }}>
            {statCard(IconTrophy, "Vedoucí tým",  leader?.name ?? "—")}
            {statCard(IconQrcode, "Aktivní QR",    activeQRs, "#d4a017")}
            {statCard(IconBell,   "Alarm",         alarmState.active ? "AKTIVNÍ" : "Klid", alarmState.active ? "#c0392b" : "#2a8a5a")}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ backgroundColor:"var(--c-bg-section)", border:"1px solid var(--c-border)", borderRadius:10, padding:20 }}>
              <p style={{ color:"var(--c-accent)", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:12 }}>ŽEBŘÍČEK TÝMŮ</p>
              <ScoreboardComponent mode={sbMode} compact showModeToggle onModeChange={setSbMode} />
            </div>
            <div style={{ backgroundColor:"var(--c-bg-section)", border:"1px solid var(--c-border)", borderRadius:10, padding:20 }}>
              <p style={{ color:"var(--c-accent)", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:12 }}>POSLEDNÍCH 5 AKCÍ</p>
              <TransactionLog maxRows={5} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="points">
          <div style={{ maxWidth:520 }}><PointAssignmentForm canCorrect /></div>
        </TabsContent>
        <TabsContent value="log"><TransactionLog canExport /></TabsContent>
        <TabsContent value="charts"><ChartsPanel /></TabsContent>
        <TabsContent value="kaichi"><KaichiPanel canEdit /></TabsContent>
        <TabsContent value="qr"><QRPanel /></TabsContent>
        <TabsContent value="alarm"><AlarmPanel /></TabsContent>
        <TabsContent value="runs"><RunSetupPanel /></TabsContent>
        <TabsContent value="wiki"><WikiAdminPanel /></TabsContent>
        <TabsContent value="settings"><GameSetupPanel /></TabsContent>
      </Tabs>
    </div>
  )
}
