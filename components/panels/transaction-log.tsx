"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconX, IconDownload } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGame } from "@/lib/game-context"
import { TEAMS } from "@/lib/data"
import { ACTION_LABELS } from "@/lib/constants"
import { formatDateTime, getCharName, getTargetName, getTeamName } from "@/lib/utils"
import { ActionBadge, RoleBadge } from "@/components/shared/badges"
import { TeamDot } from "@/components/shared/team-icon"

export function TransactionLog({
  maxRows, canExport = false, hideFilters = false,
}: {
  maxRows?: number; canExport?: boolean; hideFilters?: boolean
}) {
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
    if (search)       rows = rows.filter(e =>
      (e.note ?? "").toLowerCase().includes(search.toLowerCase()) ||
      getCharName(e.sourceCharacterId).toLowerCase().includes(search.toLowerCase())
    )
    if (maxRows) rows = rows.slice(0, maxRows)
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
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url
    a.download = "akano3-log.csv"
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filterStyle = { backgroundColor:"var(--c-input)", border:"1px solid var(--c-input-border)", fontSize:"0.8rem", height:32, color:"var(--c-text)" }

  return (
    <div>
      {!hideFilters && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16, alignItems:"center" }}>
          <div style={{ position:"relative", flex:"1 1 160px" }}>
            <IconSearch size={13} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:"var(--c-text-muted)" }} />
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
              style={{ background:"transparent", border:"1px solid var(--c-border-str)", color:"var(--c-text-muted)",
                padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:"0.75rem" }}>
              <IconX size={11} style={{display:"inline",marginRight:4}} />Smazat filtry
            </button>
          )}
          {canExport && (
            <button onClick={handleExport} style={{
              marginLeft:"auto", background:"color-mix(in srgb, var(--c-teal) 13%, transparent)", border:"1px solid color-mix(in srgb, var(--c-teal) 38%, transparent)",
              color:"var(--c-teal)", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:"0.8rem",
              display:"flex", alignItems:"center", gap:6,
            }}>
              <IconDownload size={13} /> Export CSV
            </button>
          )}
        </div>
      )}

      <div style={{ overflowX:"auto" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor:"var(--c-border)" }}>
              {["Čas","Kdo","Typ akce","Cíl","Týmy","Body","Poznámka"].map(h => (
                <TableHead key={h} style={{ color:"var(--c-text-muted)", fontSize:"0.75rem", letterSpacing:"0.05em" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign:"center", color:"var(--c-text-faint)", padding:"32px 0" }}>
                  Žádné záznamy
                </TableCell>
              </TableRow>
            )}
            {filtered.map(e => (
              <TableRow key={e.id} style={{ borderColor:"var(--c-border)" }}>
                <TableCell style={{ color:"var(--c-text-muted)", fontSize:"0.78rem", whiteSpace:"nowrap", fontFamily:"monospace" }}>
                  {formatDateTime(e.timestamp)}
                </TableCell>
                <TableCell style={{ color:"var(--c-text)", fontSize:"0.82rem" }}>
                  {getCharName(e.sourceCharacterId)}
                  <RoleBadge role={e.sourceRole} />
                </TableCell>
                <TableCell><ActionBadge type={e.actionType} /></TableCell>
                <TableCell style={{ color:"var(--c-text)", fontSize:"0.82rem" }}>
                  {getTargetName(e.targetType, e.targetId)}
                </TableCell>
                <TableCell style={{ color:"var(--c-accent)", fontSize:"0.8rem" }}>
                  {e.resolvedTeamIds.map(t => (
                    <span key={t} style={{ display:"inline-flex", alignItems:"center", marginRight:4 }}>
                      <TeamDot color={TEAMS.find(tm=>tm.id===t)?.color??"#888"} teamId={t} />
                      {getTeamName(t)}
                    </span>
                  ))}
                </TableCell>
                <TableCell style={{ fontWeight:700, fontFamily:"monospace", color: e.amount > 0 ? "var(--c-success)" : "var(--destructive)" }}>
                  {e.amount > 0 ? "+" : ""}{e.amount}
                </TableCell>
                <TableCell style={{ color:"var(--c-text-muted)", fontSize:"0.78rem", maxWidth:200 }}>
                  {e.note ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p style={{ color:"var(--c-text-faint)", fontSize:"0.72rem", marginTop:8 }}>
        {filtered.length} záznamů
      </p>
    </div>
  )
}
