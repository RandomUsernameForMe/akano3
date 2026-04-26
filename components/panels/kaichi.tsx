"use client"

import React, { useState, useMemo } from "react"
import { IconChevronUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGame } from "@/lib/game-context"
import { TEAMS } from "@/lib/data"
import { romanNumeral, getTeamName } from "@/lib/utils"
import { KaichiBadge } from "@/components/shared/badges"
import { TeamDot } from "@/components/shared/team-icon"

export function KaichiPanel({ canEdit = false }: { canEdit?: boolean }) {
  const { characters, updateKaichi } = useGame()
  const [filterTeam, setFilterTeam] = useState("")
  const [confirmId,  setConfirmId]  = useState<string | null>(null)

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
            <AlertDialogAction
              onClick={() => { if (confirmId) updateKaichi(confirmId); setConfirmId(null) }}
              style={{ backgroundColor:"#d4a01733", color:"#d4a017", border:"1px solid #d4a01760" }}>
              Potvrdit povýšení
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
