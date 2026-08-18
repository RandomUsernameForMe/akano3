"use client"

import React, { useState } from "react"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { WikiRenderer } from "@/components/shared/wiki-renderer"
import { matchesQuery } from "@/lib/wiki-search"
import { romanNumeral } from "@/lib/utils"
import type { WikiArticle } from "@/lib/types"

export function WikiIndex({ articles, kaichiLevel, query }: {
  articles: WikiArticle[]; kaichiLevel: number; query: string
}) {
  const [expanded,       setExpanded]       = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(articles.length > 0 ? [articles[0].category] : []),
  )

  function toggleCategory(cat: string) {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return next
    })
  }

  const filtered = articles.filter(a => matchesQuery(a, query))
  const searching = query.trim() !== ""
  const categories = [...new Set(filtered.map(a => a.category))]

  if (filtered.length === 0) {
    return <p style={{ color:"var(--c-text-muted)", textAlign:"center", padding:"40px 0", fontSize:"0.9rem" }}>Nic nenalezeno.</p>
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {categories.map(cat => {
        const catArticles = filtered.filter(a => a.category === cat)
        const isOpen = searching || openCategories.has(cat)
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
