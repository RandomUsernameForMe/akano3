"use client"

import React, { useCallback, useEffect, useState } from "react"
import { IconBooks, IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { WikiRenderer } from "@/components/shared/wiki-renderer"
import { romanNumeral } from "@/lib/utils"
import type { WikiArticle } from "@/lib/types"

export function WikiPanel({ characterId, kaichiLevel }: { characterId: string; kaichiLevel: number }) {
  const [articles,       setArticles]       = useState<WikiArticle[]>([])
  const [loading,        setLoading]        = useState(true)
  const [expanded,       setExpanded]       = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/wiki?characterId=${characterId}`)
      if (res.ok) {
        const data: { articles: WikiArticle[] } = await res.json()
        setArticles(data.articles)
        // auto-open first category
        if (data.articles.length > 0) setOpenCategories(new Set([data.articles[0].category]))
      }
    } finally {
      setLoading(false)
    }
  }, [characterId])

  useEffect(() => { load() }, [load])

  function toggleCategory(cat: string) {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return next
    })
  }

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

  const categories = [...new Set(articles.map(a => a.category))]

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {categories.map(cat => {
        const catArticles = articles.filter(a => a.category === cat)
        const isOpen = openCategories.has(cat)
        return (
          <div key={cat} style={{
            backgroundColor:"var(--c-bg-card)", borderRadius:6,
            border:"2px solid var(--c-border-mid)",
            boxShadow:"var(--shadow-print-sm)",
            overflow:"hidden",
          }}>
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat)}
              style={{
                all:"unset", boxSizing:"border-box", width:"100%",
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"14px 20px", cursor:"pointer",
                backgroundColor: isOpen ? "var(--c-bg-section)" : "transparent",
              }}
            >
              <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--c-text)" }}>{cat}</span>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:"0.72rem", color:"var(--c-text-muted)" }}>
                  {catArticles.length} {catArticles.length === 1 ? "článek" : catArticles.length < 5 ? "články" : "článků"}
                </span>
                {isOpen
                  ? <IconChevronDown size={16} color="var(--c-text-muted)" />
                  : <IconChevronRight size={16} color="var(--c-text-muted)" />
                }
              </div>
            </button>

            {/* Articles in category */}
            {isOpen && (
              <div style={{ borderTop:"1px solid var(--c-border)" }}>
                {catArticles.map((article, idx) => {
                  const isArticleOpen = expanded === String(article.id)
                  return (
                    <div key={article.id} style={{
                      borderTop: idx > 0 ? "1px solid var(--c-border)" : undefined,
                    }}>
                      <button
                        onClick={() => setExpanded(isArticleOpen ? null : String(article.id))}
                        style={{
                          all:"unset", boxSizing:"border-box", width:"100%",
                          display:"flex", alignItems:"center", gap:12,
                          padding:"12px 20px 12px 28px", cursor:"pointer",
                        }}
                      >
                        {article.kaichiRequired > 0 && (
                          <span style={{
                            width:20, height:20, borderRadius:"50%",
                            border:"1px solid #d4a017", backgroundColor:"#1a0a00",
                            display:"inline-flex", alignItems:"center", justifyContent:"center",
                            fontSize:"0.55rem", color:"#d4a017", fontFamily:"monospace", fontWeight:700,
                            flexShrink:0,
                          }}>
                            {romanNumeral(article.kaichiRequired)}
                          </span>
                        )}
                        <span style={{ flex:1, fontWeight:600, fontSize:"0.9rem", color:"var(--c-text)", textAlign:"left" }}>
                          {article.title}
                        </span>
                        {isArticleOpen
                          ? <IconChevronDown size={14} color="var(--c-text-muted)" />
                          : <IconChevronRight size={14} color="var(--c-text-muted)" />
                        }
                      </button>
                      {isArticleOpen && (
                        <div style={{
                          padding:"16px 28px 24px 28px",
                          borderTop:"1px solid var(--c-border)",
                        }}>
                          <WikiRenderer
                            content={article.content}
                            kaichiLevel={kaichiLevel}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
