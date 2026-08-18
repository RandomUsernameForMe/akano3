"use client"

import React, { useCallback, useEffect, useState } from "react"
import { IconBooks, IconListDetails, IconMap2, IconSearch } from "@tabler/icons-react"
import { WikiIndex } from "@/components/panels/wiki-index"
import type { WikiArticle, WikiLink } from "@/lib/types"

export function WikiPanel({ characterId, kaichiLevel }: { characterId: string; kaichiLevel: number }) {
  const [articles, setArticles] = useState<WikiArticle[]>([])
  const [links,    setLinks]    = useState<WikiLink[]>([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState<"map" | "index">("map")
  const [query,    setQuery]    = useState("")
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/wiki?characterId=${characterId}`)
      if (res.ok) {
        const data: { articles: WikiArticle[]; links: WikiLink[] } = await res.json()
        setArticles(data.articles)
        setLinks(data.links)
      }
    } finally {
      setLoading(false)
    }
  }, [characterId])

  useEffect(() => { load() }, [load])

  if (loading) {
    return <p style={{ color:"var(--c-text-muted)", textAlign:"center", padding:"40px 0" }}>Načítám…</p>
  }

  if (articles.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"60px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
        <IconBooks size={48} color="var(--c-text-faint)" strokeWidth={1.2} />
        <p style={{ color:"var(--c-text-muted)", fontSize:"0.9rem" }}>Zatím žádné informace k dispozici.</p>
      </div>
    )
  }

  const tabs = [
    { key: "map" as const,   label: "Mapa",     Icon: IconMap2 },
    { key: "index" as const, label: "Rejstřík", Icon: IconListDetails },
  ]

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* Taby + search */}
      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
        {tabs.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            all:"unset", boxSizing:"border-box", display:"flex", alignItems:"center", gap:6,
            padding:"8px 16px", cursor:"pointer", borderRadius:6,
            border:"2px solid var(--c-border-mid)", fontWeight:700, fontSize:"0.85rem",
            color: tab === key ? "var(--c-bg-card)" : "var(--c-text)",
            backgroundColor: tab === key ? "var(--c-text)" : "var(--c-bg-card)",
            boxShadow:"var(--shadow-print-sm)",
          }}>
            <Icon size={16} /> {label}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <div style={{
          display:"flex", alignItems:"center", gap:6, padding:"8px 12px", borderRadius:6,
          border:"2px solid var(--c-border-mid)", backgroundColor:"var(--c-bg-card)",
          boxShadow:"var(--shadow-print-sm)",
        }}>
          <IconSearch size={16} color="var(--c-text-muted)" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Hledej…"
            style={{ all:"unset", width:180, fontSize:"0.85rem", color:"var(--c-text)" }}
          />
        </div>
      </div>

      {tab === "index" ? (
        <WikiIndex articles={articles} kaichiLevel={kaichiLevel} query={query} />
      ) : (
        <div style={{
          minHeight:400, display:"flex", alignItems:"center", justifyContent:"center",
          backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
          borderRadius:6, boxShadow:"var(--shadow-print-sm)",
        }}>
          <p style={{ color:"var(--c-text-muted)", fontSize:"0.85rem" }}>Mapa se připravuje…</p>
        </div>
      )}
    </div>
  )
}
