"use client"

import React from "react"
import { IconMapPin } from "@tabler/icons-react"
import { WikiRenderer } from "@/components/shared/wiki-renderer"
import type { WikiArticle, WikiLink } from "@/lib/types"

export function WikiReader({ articles, links, selectedSlug, onNavigate, kaichiLevel }: {
  articles: WikiArticle[]
  links: WikiLink[]
  selectedSlug: string | null
  onNavigate: (slug: string) => void
  kaichiLevel: number
}) {
  const article = articles.find(a => a.slug === selectedSlug) ?? null

  if (!article) {
    return (
      <div style={{
        minHeight:620, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10,
        backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
        borderRadius:6, boxShadow:"var(--shadow-print-sm)",
      }}>
        <IconMapPin size={40} color="var(--c-text-faint)" strokeWidth={1.2} />
        <p style={{ color:"var(--c-text-muted)", fontSize:"0.85rem" }}>Vyber uzel na mapě.</p>
      </div>
    )
  }

  const related = links.filter(l => l.fromSlug === article.slug || l.toSlug === article.slug)
  const titleOf = (slug: string) => articles.find(a => a.slug === slug)?.title ?? slug

  return (
    <div style={{
      maxHeight:620, overflowY:"auto", padding:"20px 24px",
      backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
      borderRadius:6, boxShadow:"var(--shadow-print-sm)",
    }}>
      <p style={{ fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:1, color:"var(--c-text-muted)", marginBottom:8 }}>
        {article.category}
      </p>
      <WikiRenderer content={article.content} kaichiLevel={kaichiLevel} />
      {related.length > 0 && (
        <div style={{ marginTop:20, paddingTop:14, borderTop:"1px solid var(--c-border)" }}>
          <p style={{ fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:1, color:"var(--c-text-muted)", marginBottom:8 }}>
            Souvisí
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {related.map((l, i) => {
              const other = l.fromSlug === article.slug ? l.toSlug : l.fromSlug
              return (
                <button key={i} onClick={() => onNavigate(other)} style={{
                  all:"unset", boxSizing:"border-box", cursor:"pointer",
                  padding:"5px 10px", borderRadius:5,
                  border: l.locked ? "1px solid #d4a017" : "1px solid var(--c-border-mid)",
                  backgroundColor:"var(--c-bg-section)",
                  display:"inline-flex", gap:6, alignItems:"center",
                }}>
                  <span style={{
                    color: l.locked ? "#d4a017" : "var(--c-text-muted)",
                    fontFamily: l.locked ? "monospace" : undefined,
                    fontSize:"0.7rem",
                  }}>
                    {l.locked ? "███" : l.label}
                  </span>
                  <span style={{ fontWeight:600, fontSize:"0.78rem", color:"var(--c-text)" }}>{titleOf(other)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
