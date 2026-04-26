"use client"

import React, { useState } from "react"
import {
  IconPlus, IconDashboard, IconList, IconChartLine, IconStar, IconBell,
} from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScoreboardComponent } from "@/components/panels/scoreboard"
import { PointAssignmentForm } from "@/components/panels/point-assignment"
import { TransactionLog } from "@/components/panels/transaction-log"
import { ChartsPanel } from "@/components/panels/charts"
import { KaichiPanel } from "@/components/panels/kaichi"
import { AlarmPanel } from "@/components/panels/alarm"

export function TeacherDashboard() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ color:"#1a0a0a", fontSize:"1.5rem", fontWeight:700 }}>
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
          <SheetContent style={{ backgroundColor:"#f0f8f8", borderLeft:"1px solid rgba(107,15,26,0.15)", minWidth:380 }}>
            <SheetHeader>
              <SheetTitle style={{ color:"#1a0a0a" }}>Zadat body</SheetTitle>
            </SheetHeader>
            <div style={{ marginTop:20 }}>
              <PointAssignmentForm onClose={() => setSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="overview">
        <TabsList style={{ backgroundColor:"rgba(107,15,26,0.05)", border:"1px solid rgba(107,15,26,0.1)", marginBottom:20 }}>
          {[
            ["overview","Přehled",IconDashboard],
            ["log","Log",IconList],
            ["charts","Grafy",IconChartLine],
            ["kaichi","Kaichi",IconStar],
            ["alarm","Alarm",IconBell],
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
              <TransactionLog maxRows={8} hideFilters />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="log"><TransactionLog /></TabsContent>
        <TabsContent value="charts"><ChartsPanel /></TabsContent>
        <TabsContent value="kaichi"><KaichiPanel /></TabsContent>
        <TabsContent value="alarm"><AlarmPanel /></TabsContent>
      </Tabs>
    </div>
  )
}

export function RuzeDashboard() { return <TeacherDashboard /> }
