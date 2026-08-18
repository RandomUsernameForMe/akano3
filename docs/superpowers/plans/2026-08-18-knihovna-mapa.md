# Knihovna: Mapa + Rejstřík — implementační plán

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tab INFORMACE dostane dva pohledy — interaktivní mapu článků s kanonickými vazbami a čtecím panelem, a dnešní akordeon jako Rejstřík se searchem.

**Architecture:** Nová tabulka `wiki_links` (ruční hrany s kaichi zámky), GET `/api/wiki` vrací `{ articles, links }` s gatingem hran na serveru. Klient: `WikiPanel` se stane kontejnerem (taby + search + stav výběru), mapa je SVG s layoutem z `d3-force` (ruční středy shluků, pozice uvnitř počítá simulace, deterministicky), čtecí panel používá stávající `WikiRenderer`.

**Tech Stack:** Next.js (stávající konvence repa — pozor, viz AGENTS.md: před odchylkou od vzorů v repu čti `node_modules/next/dist/docs/`), Neon serverless SQL, `d3-force` (nová závislost), testy `node --test` s nativním TS strippingem (Node 24, vzor `lib/wiki-blocks.test.mjs`).

**Spec:** `docs/superpowers/specs/2026-08-18-knihovna-mapa-design.md`

**Známý kontext pro executora:**
- Styl komponent: žádný Tailwind ve wiki komponentách — inline `style` objekty s CSS proměnnými `--c-bg-card`, `--c-bg-section`, `--c-text`, `--c-text-muted`, `--c-text-faint`, `--c-border`, `--c-border-mid`, `--c-accent`, `--shadow-print-sm`. Zlatá pro kaichi prvky: `#d4a017`.
- DB vrací snake_case (`neon()` nemapuje). `lib/types.ts` deklaruje camelCase — GET dnes vrací syrové řádky, takže `article.kaichiRequired` v UI je latentně `undefined` (neviditelné, všech 32 článků má 0). Task 3 to opravuje mapováním na serveru; wiki-admin i wiki.tsx pak čtou správně beze změn.
- Dev server: `./start-dev.sh` (nese `DATABASE_URL`). Migrace: `POST /api/admin/migrate`. Seed: `POST /api/admin/seed-wiki`.
- Testy se pouští: `node --test lib/*.test.mjs` (žádný test script v package.json).

---

### Task 1: Větev a závislost d3-force

**Files:** jen `package.json` / `package-lock.json`

- [ ] **Step 1: Nová větev z knihovna-faze-1**

```bash
git checkout knihovna-faze-1 && git checkout -b knihovna-mapa
```

- [ ] **Step 2: Instalace d3-force**

```bash
npm install d3-force && npm install -D @types/d3-force
```

Expected: obě bez chyb; `d3-force` ^3.x v dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: d3-force pro layout mapy knihovny"
```

---

### Task 2: Tabulka wiki_links + gating hran (TDD)

**Files:**
- Modify: `app/api/admin/migrate/route.ts` (za blok `CREATE TABLE IF NOT EXISTS wiki_articles`, před `return Response.json`)
- Create: `lib/wiki-links.ts`
- Test: `lib/wiki-links.test.mjs`

- [ ] **Step 1: Failing testy**

Create `lib/wiki-links.test.mjs`:

```js
import { test } from "node:test"
import assert from "node:assert/strict"
import { gateLink, gateLinks, validateLinks } from "./wiki-links.ts"

test("hrana nad úrovní postavy je zamčená a bez labelu", () => {
  const l = gateLink({ from_slug: "a", to_slug: "b", label: "zakázal", kaichi_required: 5 }, 4)
  assert.deepEqual(l, { fromSlug: "a", toSlug: "b", label: null, locked: true })
})

test("hrana přesně na úrovni postavy je odemčená", () => {
  const l = gateLink({ from_slug: "a", to_slug: "b", label: "zakázal", kaichi_required: 5 }, 5)
  assert.deepEqual(l, { fromSlug: "a", toSlug: "b", label: "zakázal", locked: false })
})

test("kaichi_required 0 je odemčené i pro kaichi 0", () => {
  const l = gateLink({ from_slug: "a", to_slug: "b", label: "vede k", kaichi_required: 0 }, 0)
  assert.equal(l.locked, false)
})

test("gateLinks vyhodí hrany s koncem mimo viditelné články", () => {
  const links = [
    { from_slug: "a", to_slug: "b", label: "x", kaichi_required: 0 },
    { from_slug: "a", to_slug: "c", label: "y", kaichi_required: 0 },
  ]
  const out = gateLinks(links, 0, new Set(["a", "b"]))
  assert.equal(out.length, 1)
  assert.equal(out[0].toSlug, "b")
})

test("validateLinks vrátí neznámé sluggy", () => {
  const bad = validateLinks(new Set(["a"]), [
    { from_slug: "a", to_slug: "x" },
    { from_slug: "y", to_slug: "a" },
  ])
  assert.deepEqual(bad, ["x", "y"])
})

test("validateLinks na validní vstup vrátí prázdné pole", () => {
  assert.deepEqual(validateLinks(new Set(["a", "b"]), [{ from_slug: "a", to_slug: "b" }]), [])
})
```

- [ ] **Step 2: Ověř, že padají**

Run: `node --test lib/wiki-links.test.mjs`
Expected: FAIL — `Cannot find module` (wiki-links.ts neexistuje).

- [ ] **Step 3: Implementace**

Create `lib/wiki-links.ts`:

```ts
import type { WikiLink } from "@/lib/types"

export interface RawLink {
  from_slug: string
  to_slug: string
  label: string
  kaichi_required: number
}

// Zamčená hrana jde ke klientovi bez labelu — hráč vidí, ŽE spojení existuje, ne JAKÉ.
export function gateLink(link: RawLink, kaichiLevel: number): WikiLink {
  const locked = link.kaichi_required > kaichiLevel
  return { fromSlug: link.from_slug, toSlug: link.to_slug, label: locked ? null : link.label, locked }
}

export function gateLinks(links: RawLink[], kaichiLevel: number, visibleSlugs: Set<string>): WikiLink[] {
  return links
    .filter(l => visibleSlugs.has(l.from_slug) && visibleSlugs.has(l.to_slug))
    .map(l => gateLink(l, kaichiLevel))
}

export function validateLinks(
  articleSlugs: Set<string>,
  links: { from_slug: string; to_slug: string }[],
): string[] {
  const bad: string[] = []
  for (const l of links) {
    if (!articleSlugs.has(l.from_slug)) bad.push(l.from_slug)
    if (!articleSlugs.has(l.to_slug)) bad.push(l.to_slug)
  }
  return bad
}
```

Do `lib/types.ts` přidej za `WikiArticle`:

```ts
export interface WikiLink {
  fromSlug: string
  toSlug: string
  label: string | null // null = zamčeno
  locked: boolean
}
```

- [ ] **Step 4: Testy zelené**

Run: `node --test lib/wiki-links.test.mjs`
Expected: 6 pass.

- [ ] **Step 5: DDL do migrace**

V `app/api/admin/migrate/route.ts` hned za `CREATE TABLE IF NOT EXISTS wiki_articles (...)` blok přidej:

```ts
    await sql`
      CREATE TABLE IF NOT EXISTS wiki_links (
        id SERIAL PRIMARY KEY,
        from_slug TEXT NOT NULL,
        to_slug TEXT NOT NULL,
        label TEXT NOT NULL,
        kaichi_required INTEGER NOT NULL DEFAULT 0
      )
    `
```

- [ ] **Step 6: Spusť migraci**

```bash
./start-dev.sh &   # pokud dev server neběží
sleep 5 && curl -s -X POST http://localhost:3000/api/admin/migrate
```

Expected: `{"ok":true,"message":"Migrace dokončena"}`

- [ ] **Step 7: Commit**

```bash
git add lib/wiki-links.ts lib/wiki-links.test.mjs lib/types.ts app/api/admin/migrate/route.ts
git commit -m "feat: tabulka wiki_links a gating hran podle kaichi"
```

---

### Task 3: API vrací { articles, links } + camelCase mapování

**Files:**
- Modify: `app/api/wiki/route.ts` (jen GET)
- Modify: `components/panels/wiki.tsx:15-28` (funkce `load`)

- [ ] **Step 1: Přepiš GET v `app/api/wiki/route.ts`**

Nahraď celou funkci `GET` (importy nahoře doplň o `gateLinks` a typ):

```ts
import { sql } from "@/lib/db"
import { getActiveRunId } from "@/lib/runs"
import { gateLinks, type RawLink } from "@/lib/wiki-links"
import type { WikiArticle } from "@/lib/types"

export const dynamic = "force-dynamic"

function rowToArticle(r: Record<string, unknown>): WikiArticle {
  return {
    id: r.id, slug: r.slug, title: r.title, content: r.content, category: r.category,
    kaichiRequired: r.kaichi_required, sortOrder: r.sort_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  } as WikiArticle
}

// GET /api/wiki?characterId=X  — { articles, links } podle kaichi postavy
// GET /api/wiki?admin=1         — všechny články (GM use)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const admin = searchParams.get("admin") === "1"
    const characterId = searchParams.get("characterId")

    if (admin) {
      const rows = await sql`
        SELECT * FROM wiki_articles ORDER BY category, sort_order, id
      `
      return Response.json(rows.map(rowToArticle))
    }

    if (!characterId) {
      return new Response("characterId required", { status: 400 })
    }

    const runId = await getActiveRunId()
    const [state] = await sql`
      SELECT kaichi_level FROM character_state
      WHERE character_id = ${characterId} AND run_id = ${runId}
    `
    const kaichiLevel = (state?.kaichi_level as number) ?? 0

    const rows = await sql`
      SELECT * FROM wiki_articles
      WHERE kaichi_required <= ${kaichiLevel}
      ORDER BY category, sort_order, id
    `
    const articles = rows.map(rowToArticle)
    const linkRows = await sql`
      SELECT from_slug, to_slug, label, kaichi_required FROM wiki_links
    `
    const links = gateLinks(linkRows as RawLink[], kaichiLevel, new Set(articles.map(a => a.slug)))
    return Response.json({ articles, links })
  } catch (err) {
    console.error("[wiki GET]", err)
    return new Response(String(err), { status: 500 })
  }
}
```

POST nech beze změny. Pozn.: mapování `rowToArticle` v admin větvi opravuje latentní bug — `wiki-admin.tsx` čte `a.kaichiRequired`, které dosud bylo `undefined`.

- [ ] **Step 2: Uprav `load` ve `components/panels/wiki.tsx`**

Nový tvar odpovědi (stav `links` se přidá v Tasku 4, teď jen nerozbít):

```ts
      const res = await fetch(`/api/wiki?characterId=${characterId}`)
      if (res.ok) {
        const data: { articles: WikiArticle[] } = await res.json()
        setArticles(data.articles)
        // auto-open first category
        if (data.articles.length > 0) setOpenCategories(new Set([data.articles[0].category]))
      }
```

- [ ] **Step 3: Ověření**

Run: `npx tsc --noEmit`
Expected: bez chyb.
Ruční kontrola v prohlížeči (dev server): tab INFORMACE u studenta zobrazí akordeon jako dřív; GM admin seznam článků funguje a u článků s kaichi > 0 by se nově ukázal římský chip (teď žádný není — stačí, že se nic nerozbilo).

- [ ] **Step 4: Commit**

```bash
git add app/api/wiki/route.ts components/panels/wiki.tsx
git commit -m "feat: GET /api/wiki vrací articles+links, camelCase mapování řádků"
```

---

### Task 4: Search knihovna (TDD) + restrukturalizace na taby, Rejstřík

**Files:**
- Create: `lib/wiki-search.ts`
- Test: `lib/wiki-search.test.mjs`
- Create: `components/panels/wiki-index.tsx` (přesun akordeonu)
- Modify: `components/panels/wiki.tsx` (kontejner: taby + search)

- [ ] **Step 1: Failing testy**

Create `lib/wiki-search.test.mjs`:

```js
import { test } from "node:test"
import assert from "node:assert/strict"
import { matchesQuery, searchNorm } from "./wiki-search.ts"

test("searchNorm odstraní diakritiku a velikost písmen", () => {
  assert.equal(searchNorm("Jestřáb"), "jestrab")
})

test("prázdný nebo bílý dotaz projde vždy", () => {
  assert.ok(matchesQuery({ title: "A", content: "B" }, "  "))
})

test("najde v názvu bez ohledu na diakritiku", () => {
  assert.ok(matchesQuery({ title: "Jestřáb", content: "" }, "jestrab"))
})

test("najde v textu bez ohledu na velikost", () => {
  assert.ok(matchesQuery({ title: "X", content: "tajný junkin" }, "JUNKIN"))
})

test("nenajde nesouvisející", () => {
  assert.ok(!matchesQuery({ title: "X", content: "Y" }, "junkin"))
})
```

- [ ] **Step 2: Ověř FAIL**

Run: `node --test lib/wiki-search.test.mjs`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementace**

Create `lib/wiki-search.ts`:

```ts
export function searchNorm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function matchesQuery(a: { title: string; content: string }, query: string): boolean {
  const q = searchNorm(query.trim())
  if (!q) return true
  return searchNorm(a.title).includes(q) || searchNorm(a.content).includes(q)
}
```

- [ ] **Step 4: Testy zelené**

Run: `node --test lib/wiki-search.test.mjs`
Expected: 5 pass.

- [ ] **Step 5: Vytvoř `components/panels/wiki-index.tsx`**

Přesun dnešního akordeonu z `wiki.tsx` (řádky 53–144) do vlastní komponenty + filtr. Kompletní obsah souboru:

```tsx
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
```

- [ ] **Step 6: Přepiš `components/panels/wiki.tsx` na kontejner**

Kompletní nový obsah (mapa zatím placeholder — přijde v Tasku 6; do té doby tab Mapa ukazuje jen prázdný rám, to je v pořádku pro commit, ale netlač to do main):

```tsx
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
```

Pozn.: `links` a `selectedSlug` se zapojí v Tasku 6 — TypeScript na nepoužité proměnné v tsx nehlásí error, nech je tady, ať Task 6 jen vyměňuje placeholder.

- [ ] **Step 7: Ověření**

Run: `npx tsc --noEmit && node --test lib/*.test.mjs`
Expected: bez chyb, všechny testy pass.
Prohlížeč: tab Rejstřík = původní akordeon; search filtruje a rozbalí kategorie; „Nic nenalezeno." na nesmyslný dotaz; tab Mapa ukazuje placeholder.

- [ ] **Step 8: Commit**

```bash
git add lib/wiki-search.ts lib/wiki-search.test.mjs components/panels/wiki-index.tsx components/panels/wiki.tsx
git commit -m "feat: taby Mapa/Rejstřík, search v rejstříku"
```

---

### Task 5: Layout mapy (TDD)

**Files:**
- Create: `lib/wiki-map-layout.ts`
- Test: `lib/wiki-map-layout.test.mjs`

- [ ] **Step 1: Failing testy**

Create `lib/wiki-map-layout.test.mjs`:

```js
import { test } from "node:test"
import assert from "node:assert/strict"
import { computeLayout } from "./wiki-map-layout.ts"

const arts = [
  { slug: "a", title: "A", category: "Lovci" },
  { slug: "b", title: "B", category: "Lovci" },
  { slug: "c", title: "C", category: "Svět" },
]
const links = [
  { fromSlug: "a", toSlug: "c", label: "x", locked: false },
  { fromSlug: "a", toSlug: "b", label: null, locked: true },
]

test("layout je deterministický", () => {
  const l1 = computeLayout(arts, links)
  const l2 = computeLayout(arts, links)
  assert.deepEqual(l1.nodes.map(n => [n.x, n.y]), l2.nodes.map(n => [n.x, n.y]))
})

test("všechny uzly mají konečné souřadnice a poloměr", () => {
  const { nodes } = computeLayout(arts, links)
  assert.equal(nodes.length, 3)
  for (const n of nodes) {
    assert.ok(Number.isFinite(n.x) && Number.isFinite(n.y) && n.r > 0)
  }
})

test("jedna obálka na kategorii, obsahuje své uzly", () => {
  const { nodes, hulls } = computeLayout(arts, links)
  assert.deepEqual(hulls.map(h => h.category).sort(), ["Lovci", "Svět"])
  for (const h of hulls) {
    for (const n of nodes.filter(n => n.category === h.category)) {
      assert.ok(n.x >= h.x && n.x <= h.x + h.width)
      assert.ok(n.y >= h.y && n.y <= h.y + h.height)
    }
  }
})

test("uzel s více hranami je větší", () => {
  const { nodes } = computeLayout(arts, links)
  const a = nodes.find(n => n.slug === "a")
  const c = nodes.find(n => n.slug === "c")
  assert.ok(a.r > c.r)
})

test("prázdný vstup nespadne", () => {
  const l = computeLayout([], [])
  assert.deepEqual(l.nodes, [])
  assert.ok(l.width > 0 && l.height > 0)
})
```

- [ ] **Step 2: Ověř FAIL**

Run: `node --test lib/wiki-map-layout.test.mjs`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementace**

Create `lib/wiki-map-layout.ts`:

```ts
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force"
import type { WikiArticle, WikiLink } from "@/lib/types"

export interface MapNode { slug: string; title: string; category: string; x: number; y: number; r: number }
export interface MapHull { category: string; x: number; y: number; width: number; height: number }
export interface MapLayout { nodes: MapNode[]; hulls: MapHull[]; width: number; height: number }

// Jediný ručně laděný vstup mapy: středy shluků kategorií (souřadnice ~1000×840 plátna).
export const CLUSTER_CENTERS: Record<string, { x: number; y: number }> = {
  "Akano3":           { x: 500, y: 330 },
  "Lovci":            { x: 810, y: 200 },
  "Historie":         { x: 190, y: 190 },
  "Svět":             { x: 170, y: 520 },
  "Řád a společnost": { x: 470, y: 650 },
  "Monstra":          { x: 830, y: 620 },
  "Junkin":           { x: 860, y: 410 },
}
const FALLBACK_CENTER = { x: 500, y: 420 }
const HULL_PADDING = 34

type SimNode = MapNode & { index?: number; vx?: number; vy?: number }

export function computeLayout(
  articles: Pick<WikiArticle, "slug" | "title" | "category">[],
  links: WikiLink[],
): MapLayout {
  if (articles.length === 0) return { nodes: [], hulls: [], width: 1000, height: 840 }

  const degree = new Map<string, number>()
  for (const l of links) {
    degree.set(l.fromSlug, (degree.get(l.fromSlug) ?? 0) + 1)
    degree.set(l.toSlug,   (degree.get(l.toSlug)   ?? 0) + 1)
  }

  const nodes: SimNode[] = articles.map((a, i) => {
    const c = CLUSTER_CENTERS[a.category] ?? FALLBACK_CENTER
    return {
      slug: a.slug, title: a.title, category: a.category,
      // deterministický rozptyl výchozích pozic — simulace pak nesahá po náhodě
      x: c.x + 60 * Math.cos(i * 2.4), y: c.y + 60 * Math.sin(i * 2.4),
      r: Math.min(20, 9 + 2 * (degree.get(a.slug) ?? 0)),
    }
  })
  const bySlug = new Set(nodes.map(n => n.slug))
  const simLinks = links
    .filter(l => bySlug.has(l.fromSlug) && bySlug.has(l.toSlug))
    .map(l => ({ source: l.fromSlug, target: l.toSlug }))

  forceSimulation(nodes)
    .force("link", forceLink<SimNode, { source: string; target: string }>(simLinks)
      .id(n => n.slug).distance(80).strength(0.25))
    .force("charge", forceManyBody().strength(-160))
    .force("x", forceX<SimNode>(n => (CLUSTER_CENTERS[n.category] ?? FALLBACK_CENTER).x).strength(0.22))
    .force("y", forceY<SimNode>(n => (CLUSTER_CENTERS[n.category] ?? FALLBACK_CENTER).y).strength(0.22))
    .force("collide", forceCollide<SimNode>(n => n.r + 16))
    .stop()
    .tick(300)

  const hulls: MapHull[] = [...new Set(nodes.map(n => n.category))].map(cat => {
    const ns = nodes.filter(n => n.category === cat)
    const minX = Math.min(...ns.map(n => n.x - n.r)), maxX = Math.max(...ns.map(n => n.x + n.r))
    const minY = Math.min(...ns.map(n => n.y - n.r)), maxY = Math.max(...ns.map(n => n.y + n.r))
    return {
      category: cat,
      x: minX - HULL_PADDING, y: minY - HULL_PADDING,
      width: maxX - minX + 2 * HULL_PADDING, height: maxY - minY + 2 * HULL_PADDING,
    }
  })

  const minHX = Math.min(...hulls.map(h => h.x)),      minHY = Math.min(...hulls.map(h => h.y))
  const maxHX = Math.max(...hulls.map(h => h.x + h.width)), maxHY = Math.max(...hulls.map(h => h.y + h.height))
  // posuň vše do kladných souřadnic s okrajem 20
  const dx = 20 - minHX, dy = 20 - minHY
  for (const n of nodes) { n.x += dx; n.y += dy }
  for (const h of hulls) { h.x += dx; h.y += dy }

  return { nodes, hulls, width: maxHX - minHX + 40, height: maxHY - minHY + 40 }
}
```

- [ ] **Step 4: Testy zelené**

Run: `node --test lib/wiki-map-layout.test.mjs`
Expected: 5 pass.

- [ ] **Step 5: Commit**

```bash
git add lib/wiki-map-layout.ts lib/wiki-map-layout.test.mjs
git commit -m "feat: deterministický d3-force layout mapy se shluky kategorií"
```

---

### Task 6: Komponenta mapy + zapojení do WikiPanel

**Files:**
- Create: `components/panels/wiki-map.tsx`
- Modify: `components/panels/wiki.tsx` (výměna placeholderu, `matchedSlugs`)

- [ ] **Step 1: Vytvoř `components/panels/wiki-map.tsx`**

```tsx
"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { MapLayout } from "@/lib/wiki-map-layout"
import type { WikiLink } from "@/lib/types"

// 7 pevných odstínů pro obálky shluků — nízká sytost, funguje ve světlém i tmavém tématu
const HULL_HUES = [210, 30, 120, 275, 350, 170, 55]

interface Props {
  layout: MapLayout
  links: WikiLink[]
  selectedSlug: string | null
  onSelect: (slug: string) => void
  matchedSlugs: Set<string>
  queryActive: boolean
}

export function WikiMap({ layout, links, selectedSlug, onSelect, matchedSlugs, queryActive }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 })
  const drag = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null)

  const pos = useMemo(() => new Map(layout.nodes.map(n => [n.slug, n])), [layout])

  // převod z px prohlížeče do jednotek viewBoxu
  function toViewUnits(clientX: number, clientY: number) {
    const rect = svgRef.current!.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (layout.width / rect.width),
      y: (clientY - rect.top) * (layout.height / rect.height),
    }
  }

  // wheel zoom ručním listenerem — Reactí onWheel je pasivní a preventDefault nefunguje
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const p = toViewUnits(e.clientX, e.clientY)
      setView(v => {
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
        const scale = Math.min(4, Math.max(0.4, v.scale * factor))
        const k = scale / v.scale
        // bod pod kurzorem zůstane pod kurzorem
        return { scale, tx: p.x - k * (p.x - v.tx), ty: p.y - k * (p.y - v.ty) }
      })
    }
    svg.addEventListener("wheel", onWheel, { passive: false })
    return () => svg.removeEventListener("wheel", onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.width, layout.height])

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const p = toViewUnits(e.clientX, e.clientY)
    drag.current = { px: p.x, py: p.y, tx: view.tx, ty: view.ty }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!drag.current) return
    const p = toViewUnits(e.clientX, e.clientY)
    setView(v => ({ ...v, tx: drag.current!.tx + (p.x - drag.current!.px), ty: drag.current!.ty + (p.y - drag.current!.py) }))
  }
  function onPointerUp() { drag.current = null }

  const touchesSelected = (l: WikiLink) =>
    selectedSlug !== null && (l.fromSlug === selectedSlug || l.toSlug === selectedSlug)

  return (
    <div style={{
      backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
      borderRadius:6, boxShadow:"var(--shadow-print-sm)", overflow:"hidden",
    }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{ display:"block", width:"100%", height:620, cursor: drag.current ? "grabbing" : "grab", touchAction:"none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <g transform={`translate(${view.tx},${view.ty}) scale(${view.scale})`}>
          {/* Obálky shluků */}
          {layout.hulls.map((h, i) => (
            <g key={h.category}>
              <rect
                x={h.x} y={h.y} width={h.width} height={h.height} rx={24}
                fill={`hsla(${HULL_HUES[i % HULL_HUES.length]}, 45%, 50%, 0.09)`}
                stroke={`hsla(${HULL_HUES[i % HULL_HUES.length]}, 45%, 50%, 0.35)`}
                strokeWidth={1.5}
              />
              <text
                x={h.x + 14} y={h.y + 20}
                style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}
                fill="var(--c-text-muted)"
              >
                {h.category}
              </text>
            </g>
          ))}

          {/* Hrany */}
          {links.map((l, i) => {
            const a = pos.get(l.fromSlug), b = pos.get(l.toSlug)
            if (!a || !b) return null
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
            const showLabel = l.locked || (touchesSelected(l) && l.label)
            return (
              <g key={i}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={l.locked ? "#d4a017" : "var(--c-border-mid)"}
                  strokeWidth={touchesSelected(l) ? 2.5 : 1.5}
                  strokeDasharray={l.locked ? "6 4" : undefined}
                  opacity={0.85}
                />
                {showLabel && (
                  <text
                    x={mx} y={my - 4} textAnchor="middle"
                    style={{ fontSize:9, fontFamily: l.locked ? "monospace" : undefined, paintOrder:"stroke" }}
                    fill={l.locked ? "#d4a017" : "var(--c-text-muted)"}
                    stroke="var(--c-bg-card)" strokeWidth={3}
                  >
                    {l.locked ? "███" : l.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Uzly */}
          {layout.nodes.map(n => {
            const dimmed = queryActive && !matchedSlugs.has(n.slug)
            const selected = n.slug === selectedSlug
            return (
              <g
                key={n.slug}
                onClick={() => onSelect(n.slug)}
                style={{ cursor:"pointer" }}
                opacity={dimmed ? 0.2 : 1}
              >
                <circle
                  cx={n.x} cy={n.y} r={n.r}
                  fill={selected ? "var(--c-bg-section)" : "var(--c-bg-card)"}
                  stroke={selected ? "var(--c-accent)" : "var(--c-text)"}
                  strokeWidth={selected ? 3 : 2}
                />
                <text
                  x={n.x} y={n.y + n.r + 13} textAnchor="middle"
                  style={{ fontSize:11, fontWeight:600, paintOrder:"stroke" }}
                  fill="var(--c-text)" stroke="var(--c-bg-card)" strokeWidth={3}
                >
                  {n.title}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Zapoj do `components/panels/wiki.tsx`**

Doplň importy:

```ts
import { useMemo } from "react"            // rozšíř stávající react import
import { WikiMap } from "@/components/panels/wiki-map"
import { computeLayout } from "@/lib/wiki-map-layout"
import { matchesQuery } from "@/lib/wiki-search"
```

Nad `if (loading)` přidej (hooky musí být před early returny — dej je hned za `useEffect`):

```ts
  const layout = useMemo(() => computeLayout(articles, links), [articles, links])
  const matchedSlugs = useMemo(
    () => new Set(articles.filter(a => matchesQuery(a, query)).map(a => a.slug)),
    [articles, query],
  )
```

Placeholder mapy nahraď:

```tsx
        <div style={{ display:"flex", gap:12, alignItems:"stretch", flexWrap:"wrap" }}>
          <div style={{ flex:"3 1 420px", minWidth:0 }}>
            <WikiMap
              layout={layout}
              links={links}
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
              matchedSlugs={matchedSlugs}
              queryActive={query.trim() !== ""}
            />
          </div>
          <div style={{ flex:"2 1 300px", minWidth:280 }}>
            {/* WikiReader přijde v Tasku 7 */}
            <div style={{
              minHeight:620, display:"flex", alignItems:"center", justifyContent:"center",
              backgroundColor:"var(--c-bg-card)", border:"2px solid var(--c-border-mid)",
              borderRadius:6, boxShadow:"var(--shadow-print-sm)",
            }}>
              <p style={{ color:"var(--c-text-muted)", fontSize:"0.85rem" }}>
                {selectedSlug ?? "Vyber uzel na mapě."}
              </p>
            </div>
          </div>
        </div>
```

- [ ] **Step 3: Ověření**

Run: `npx tsc --noEmit`
Expected: bez chyb.
Prohlížeč: mapa se vykreslí (uzly ve shlucích s barevnými obálkami a popisky kategorií), zoom kolečkem drží bod pod kurzorem, drag posouvá, klik na uzel ukáže slug v pravém panelu, search ztlumí neodpovídající uzly. Hrany zatím nejsou (tabulka prázdná) — jen zkontroluj, že nic nespadlo.

- [ ] **Step 4: Commit**

```bash
git add components/panels/wiki-map.tsx components/panels/wiki.tsx
git commit -m "feat: SVG mapa knihovny se zoomem, panem a výběrem uzlu"
```

---

### Task 7: Čtecí panel se Souvisí chipy

**Files:**
- Create: `components/panels/wiki-reader.tsx`
- Modify: `components/panels/wiki.tsx` (výměna placeholderu čtecího panelu)

- [ ] **Step 1: Vytvoř `components/panels/wiki-reader.tsx`**

```tsx
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
```

- [ ] **Step 2: Zapoj do `components/panels/wiki.tsx`**

Import: `import { WikiReader } from "@/components/panels/wiki-reader"`. Placeholder z Tasku 6 (div s „Vyber uzel na mapě.") nahraď:

```tsx
          <div style={{ flex:"2 1 300px", minWidth:280 }}>
            <WikiReader
              articles={articles}
              links={links}
              selectedSlug={selectedSlug}
              onNavigate={setSelectedSlug}
              kaichiLevel={kaichiLevel}
            />
          </div>
```

- [ ] **Step 3: Ověření**

Run: `npx tsc --noEmit`
Expected: bez chyb.
Prohlížeč: klik na uzel otevře článek vpravo (rendrovaný přes WikiRenderer, včetně `:::kN` bloků); prázdný stav s ikonou špendlíku. Souvisí sekce se ukáže až po Tasku 8 (hrany zatím nejsou).

- [ ] **Step 4: Commit**

```bash
git add components/panels/wiki-reader.tsx components/panels/wiki.tsx
git commit -m "feat: čtecí panel mapy se sekcí Souvisí"
```

---

### Task 8: Kanonické hrany — návrh, schválení, seed

**Files:**
- Modify: `app/api/admin/seed-wiki/route.ts` (pole `LINKS` + validace + insert v POST)
- Create (pracovní, necommituje se): návrhová tabulka hran

> **CHECKPOINT: tento task obsahuje povinnou zastávku na schválení uživatelem. Bez schválení tabulky hran se nesmí pokračovat na Step 4.**

- [ ] **Step 1: Načti kanon**

Přečti všech 32 článků v `ARTICLES` v `app/api/admin/seed-wiki/route.ts` (sluggy: `grep -n 'slug:' app/api/admin/seed-wiki/route.ts`) a design doc `docs/superpowers/specs/2026-08-06-knihovna-obsah-design.md` (tabulka tajemství podle kaichi).

- [ ] **Step 2: Navrhni hrany**

~50–80 hran. Pravidla:
- Label = krátké sloveso/fráze z pohledu `from` → `to`: „zakázal", „vede k", „vytěžuje", „vybila posádku", „cílí na". Bez teček, max ~3 slova.
- Každý článek aspoň 1 hrana; průměr 2–3 na článek. Přednost mají mezikategorové vazby (na mapě jsou to mosty).
- `kaichi_required` hrany: pokud vztah prozrazuje obsah `:::kN` bloku, hrana dostane zámek N (např. vazba odhalující tajemství z `:::k5` má `kaichi_required: 5`). Vazby plynoucí z veřejného textu mají 0.
- Žádné duplicity (a→b a b→a je duplicitní — směr vyber podle toho, kdo „působí").

Výstup: markdown tabulka `| from_slug | label | to_slug | kaichi | zdůvodnění (1 věta) |` — ulož do scratchpadu a **předlož uživateli v terminálu po kategoriích**.

- [ ] **Step 3: STOP — čekej na schválení**

Uživatel tabulku schválí nebo upraví. Nepokračuj bez explicitního souhlasu.

- [ ] **Step 4: Zapiš `LINKS` do seed route**

Za pole `ARTICLES` v `app/api/admin/seed-wiki/route.ts`:

```ts
const LINKS = [
  { from_slug: "…", to_slug: "…", label: "…", kaichi_required: 0 },
  // … schválené hrany …
]
```

POST rozšiř (import `validateLinks` z `@/lib/wiki-links`):

```ts
export async function POST() {
  try {
    const slugs = new Set(ARTICLES.map(a => a.slug))
    const bad = validateLinks(slugs, LINKS)
    if (bad.length > 0) {
      return new Response(`Neznámé sluggy vazeb: ${bad.join(", ")}`, { status: 400 })
    }
    await sql`DELETE FROM wiki_articles`
    for (const a of ARTICLES) {
      await sql`
        INSERT INTO wiki_articles (slug, title, category, kaichi_required, sort_order, content)
        VALUES (${a.slug}, ${a.title}, ${a.category}, ${a.kaichi_required}, ${a.sort_order}, ${a.content})
      `
    }
    await sql`DELETE FROM wiki_links`
    for (const l of LINKS) {
      await sql`
        INSERT INTO wiki_links (from_slug, to_slug, label, kaichi_required)
        VALUES (${l.from_slug}, ${l.to_slug}, ${l.label}, ${l.kaichi_required})
      `
    }
    return Response.json({ ok: true, inserted: ARTICLES.length, links: LINKS.length })
  } catch (err) {
    console.error("[seed-wiki]", err)
    return new Response(String(err), { status: 500 })
  }
}
```

- [ ] **Step 5: Seed a ověření**

```bash
curl -s -X POST http://localhost:3000/api/admin/seed-wiki
```

Expected: `{"ok":true,"inserted":32,"links":<počet>}`

Run: `npx tsc --noEmit` — bez chyb.

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/seed-wiki/route.ts
git commit -m "canon: kanonické vazby mezi články knihovny"
```

---

### Task 9: Závěrečná verifikace

- [ ] **Step 1: Všechny testy a typy**

```bash
node --test lib/*.test.mjs && npx tsc --noEmit
```

Expected: vše pass, žádné chyby typů.

- [ ] **Step 2: Vizuální kontrola v běžící appce**

Projdi jako student s nízkým kaichi (0–2) a pak si nech GMem zvednout kaichi (panel Kaichi) na 6+:
- mapa: hrany viditelné, zamčené čárkované se zlatým ███, po zvednutí kaichi se labely odemknou
- klik na uzel → článek vpravo, Souvisí chipy fungují a navigují (zvýrazní uzel)
- search: ztlumení v mapě, filtr v rejstříku
- rejstřík: chová se jako původní akordeon
- světlé i tmavé téma

- [ ] **Step 3: Styl textu labelů**

Spusť skill `wiki-styl` nad novými texty labelů, pokud vznikly delší popisky (labely hran jsou krátké — pravděpodobně no-op, ale zkontroluj).

- [ ] **Step 4: Merge rozhodnutí**

Nabídni uživateli: merge `knihovna-mapa` → `knihovna-faze-1`, nebo nechat na review. Nemerguj bez vyzvání.
