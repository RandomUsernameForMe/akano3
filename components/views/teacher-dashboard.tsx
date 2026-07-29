"use client"

import React, { useState } from "react"
import {
  IconPlus, IconDashboard, IconList, IconChartLine, IconUsers, IconBell,
} from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScoreboardComponent } from "@/components/panels/scoreboard"
import { PointAssignmentForm } from "@/components/panels/point-assignment"
import { TransactionLog } from "@/components/panels/transaction-log"
import { ChartsPanel } from "@/components/panels/charts"
import { PeoplePanel } from "@/components/panels/people"
import { AlarmPanel } from "@/components/panels/alarm"

export function TeacherDashboard() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sbMode,    setSbMode]    = useState<"students" | "teams" | "units" | "circles">("teams")

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ color:"var(--c-text)", fontSize:"1.5rem", fontWeight:700 }}>
          Učitelský přehled
        </h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={<button />}
            style={{ backgroundColor:"var(--c-teal)", color:"#F4ECDF", fontWeight:700,
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
              <PointAssignmentForm onClose={() => setSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="overview">
        <TabsList style={{ backgroundColor:"var(--c-bg-section)", border:"1px solid var(--c-border)", marginBottom:20 }}>
          {[
            ["overview","Přehled",IconDashboard],
            ["log","Log",IconList],
            ["charts","Grafy",IconChartLine],
            ["people","Lidé",IconUsers],
            ["alarm","Alarm",IconBell],
          ].map(([v,label,Icon]) => (
            <TabsTrigger key={v as string} value={v as string}
              style={{ color:"var(--c-text-muted)", fontSize:"0.8rem", display:"flex", alignItems:"center", gap:5 }}>
              {React.createElement(Icon as React.ElementType, {size:13})}
              {label as string}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ backgroundColor:"var(--c-bg-section)", border:"1px solid var(--c-border)", borderRadius:10, padding:20 }}>
              <p style={{ color:"var(--c-accent)", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:12 }}>ŽEBŘÍČEK</p>
              <ScoreboardComponent mode={sbMode} compact showModeToggle onModeChange={setSbMode} />
            </div>
            <div style={{ backgroundColor:"var(--c-bg-section)", border:"1px solid var(--c-border)", borderRadius:10, padding:20 }}>
              <p style={{ color:"var(--c-accent)", fontSize:"0.8rem", letterSpacing:"0.08em", marginBottom:12 }}>POSLEDNÍ AKCE</p>
              <TransactionLog maxRows={8} hideFilters />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="log"><TransactionLog /></TabsContent>
        <TabsContent value="charts"><ChartsPanel /></TabsContent>
        <TabsContent value="people"><PeoplePanel /></TabsContent>
        <TabsContent value="alarm"><AlarmPanel /></TabsContent>
      </Tabs>
    </div>
  )
}

