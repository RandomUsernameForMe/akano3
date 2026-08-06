# Knihovna Akano3 — Fáze 1 (svislý řez)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nahradit placeholderový obsah knihovny čtyřmi skutečnými články napříč celou kaichi škálou, přidat rendereru blok `:::reviseN` a zpřístupnit knihovnu učitelům.

**Architecture:** Parser bloků se vytáhne z `wiki-renderer.tsx` do čistého modulu `lib/wiki-blocks.ts` bez JSX, aby šel testovat `node --test` bez nové závislosti. Renderer zůstane hloupý — jen kreslí, co parser vrátí. Tělo knihovny se vytáhne ze `student-dashboard.tsx` do `components/panels/wiki.tsx`, aby ho mohl použít i učitelský dashboard.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Node 24 (`node --test` + nativní stripování typů), Neon Postgres přes `@neondatabase/serverless`.

**Spec:** `docs/superpowers/specs/2026-08-06-knihovna-obsah-design.md`

---

## Struktura souborů

| Soubor | Odpovědnost |
|---|---|
| `lib/wiki-blocks.ts` *(nový)* | Čistý parser markdownu na bloky. Žádný React, žádné JSX. |
| `lib/wiki-blocks.test.mjs` *(nový)* | Testy parseru. Spouští `node --test`. |
| `components/shared/wiki-renderer.tsx` *(úprava)* | Jen vykreslování. Parser importuje. |
| `components/panels/wiki.tsx` *(nový)* | Tělo knihovny — načtení, kategorie, rozbalování. Sdílené mezi dashboardy. |
| `components/views/student-dashboard.tsx` *(úprava)* | Wiki tab deleguje na `WikiPanel`. |
| `components/views/teacher-dashboard.tsx` *(úprava)* | Přibývá tab „Informace". |
| `lib/data.ts` *(úprava)* | Oprava kaichi úrovní podle kánonu. |
| `app/api/admin/seed-wiki/route.ts` *(úprava)* | Přepis `ARTICLES` na skutečný obsah. |

**Poznámka k rozsahu:** spec uvádí ve fázi 1 tři články. Plán jich má **čtyři** — přibývá *Návrat*, protože je to jediný článek, který blok `:::reviseN` skutečně používá. Bez něj by se nová funkce rendereru neověřila na reálném obsahu.

---

## Task 1: Vytáhnout parser do vlastního modulu

Čistý přesun, žádná změna chování. Nejdřív testy proti stávajícímu chování, pak přesun.

**Files:**
- Create: `lib/wiki-blocks.ts`
- Create: `lib/wiki-blocks.test.mjs`
- Modify: `components/shared/wiki-renderer.tsx`

- [ ] **Step 1: Napsat modul s typy a parserem**

Vytvoř `lib/wiki-blocks.ts`. Obsah je přesná kopie logiky z `wiki-renderer.tsx:11-44`, jen exportovaná a bez JSX:

```ts
export type Block =
  | { type: "md"; lines: string[]; revisedAtLevel?: number }
  | { type: "secret"; requiredLevel: number; lines: string[]; revisedAtLevel?: number }
  | { type: "revision"; requiredLevel: number; lines: string[] }

export function parseBlocks(content: string): Block[] {
  const rawLines = content.split("\n")
  const blocks: Block[] = []
  let currentMd: string[] = []
  let i = 0

  while (i < rawLines.length) {
    const line = rawLines[i]
    const fenceMatch = line.match(/^:::k(\d+)\s*$/)
    if (fenceMatch) {
      if (currentMd.length) {
        blocks.push({ type: "md", lines: currentMd })
        currentMd = []
      }
      const requiredLevel = parseInt(fenceMatch[1])
      const secretLines: string[] = []
      i++
      while (i < rawLines.length && rawLines[i].trim() !== ":::") {
        secretLines.push(rawLines[i])
        i++
      }
      blocks.push({ type: "secret", requiredLevel, lines: secretLines })
    } else {
      currentMd.push(line)
    }
    i++
  }
  if (currentMd.length) blocks.push({ type: "md", lines: currentMd })
  return blocks
}
```

Pozor: typ bloku se přejmenoval z `redacted` na `secret`. Renderer se opraví v kroku 4.

- [ ] **Step 2: Napsat testy stávajícího chování**

Vytvoř `lib/wiki-blocks.test.mjs`:

```js
import { test } from "node:test"
import assert from "node:assert/strict"
import { parseBlocks } from "./wiki-blocks.ts"

test("prostý markdown je jeden md blok", () => {
  const blocks = parseBlocks("# Nadpis\n\nOdstavec.")
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].type, "md")
  assert.deepEqual(blocks[0].lines, ["# Nadpis", "", "Odstavec."])
})

test("blok :::k3 se rozpozná jako secret s úrovní 3", () => {
  const blocks = parseBlocks("Veřejné.\n:::k3\nTajné.\n:::")
  assert.equal(blocks.length, 2)
  assert.equal(blocks[0].type, "md")
  assert.equal(blocks[1].type, "secret")
  assert.equal(blocks[1].requiredLevel, 3)
  assert.deepEqual(blocks[1].lines, ["Tajné."])
})

test("text po uzavření tajného bloku pokračuje jako md", () => {
  const blocks = parseBlocks(":::k2\nTajné.\n:::\nZase veřejné.")
  assert.equal(blocks.length, 2)
  assert.equal(blocks[0].type, "secret")
  assert.equal(blocks[1].type, "md")
  assert.deepEqual(blocks[1].lines, ["Zase veřejné."])
})

test("víc tajných bloků za sebou", () => {
  const blocks = parseBlocks(":::k4\nA\n:::\n:::k7\nB\n:::")
  assert.equal(blocks.length, 2)
  assert.equal(blocks[0].requiredLevel, 4)
  assert.equal(blocks[1].requiredLevel, 7)
})

test("neuzavřený blok spolkne zbytek dokumentu", () => {
  const blocks = parseBlocks("Veřejné.\n:::k5\nTajné bez konce.")
  assert.equal(blocks.length, 2)
  assert.equal(blocks[1].type, "secret")
  assert.deepEqual(blocks[1].lines, ["Tajné bez konce."])
})

test("prázdný vstup vrátí jeden prázdný md blok", () => {
  // "".split("\n") je [""], takže currentMd skončí jako [""] a projde flushem.
  // Tenhle test dokumentuje stávající chování, nemění ho.
  const blocks = parseBlocks("")
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].type, "md")
  assert.deepEqual(blocks[0].lines, [""])
})
```

- [ ] **Step 3: Spustit testy**

Run: `node --test lib/`
Expected: PASS, `# pass 6`, `# fail 0`

- [ ] **Step 4: Přepojit renderer na nový modul**

V `components/shared/wiki-renderer.tsx` smaž lokální `type Block` (řádky 11–13) i funkci `parseBlocks` (řádky 15–44) a nahoru přidej import:

```tsx
import { parseBlocks, type Block } from "@/lib/wiki-blocks"
```

Ve `WikiRenderer` (řádek ~172) změň porovnání typu z `redacted` na `secret`:

```tsx
{blocks.map((block, i) => {
  if (block.type === "md") return <MdBlock key={i} lines={block.lines} />
  return (
    <RedactedBlock
      key={i}
      lines={block.lines}
      requiredLevel={block.requiredLevel}
      unlocked={kaichiLevel >= block.requiredLevel}
    />
  )
})}
```

- [ ] **Step 5: Ověřit, že build projde**

Run: `npx next build`
Expected: build proběhne bez chyb TypeScriptu

- [ ] **Step 6: Commit**

```bash
git add lib/wiki-blocks.ts lib/wiki-blocks.test.mjs components/shared/wiki-renderer.tsx
git commit -m "refactor: parser bloků do lib/wiki-blocks.ts s testy"
```

---

## Task 2: Přidat parsování bloku `:::reviseN`

**Files:**
- Modify: `lib/wiki-blocks.ts`
- Modify: `lib/wiki-blocks.test.mjs`

Chování: `:::reviseN` označí **bezprostředně předcházející blok** jako revidovaný na úrovni N.
- Předchází-li `md` blok, odštěpí se jeho **poslední odstavec** do vlastního `md` bloku s `revisedAtLevel: N`. Odstavec = souvislá skupina neprázdných řádků na konci.
- Předchází-li `secret` blok, dostane `revisedAtLevel: N` celý.
- Nepředchází-li nic, revizní blok se přidá a nic se neoznačí.

- [ ] **Step 1: Napsat failující testy**

Přidej na konec `lib/wiki-blocks.test.mjs`:

```js
test(":::revise6 se rozpozná jako revision", () => {
  const blocks = parseBlocks("Tvrzení.\n:::revise6\nNeplatí.\n:::")
  const revision = blocks.find(b => b.type === "revision")
  assert.ok(revision)
  assert.equal(revision.requiredLevel, 6)
  assert.deepEqual(revision.lines, ["Neplatí."])
})

test("revize odštěpí poslední odstavec předchozího md bloku", () => {
  const blocks = parseBlocks("# Nadpis\n\nPrvní odstavec.\n\nTvrzení.\n:::revise6\nNeplatí.\n:::")
  assert.equal(blocks.length, 3)
  assert.equal(blocks[0].type, "md")
  assert.deepEqual(blocks[0].lines, ["# Nadpis", "", "První odstavec.", ""])
  assert.equal(blocks[1].type, "md")
  assert.deepEqual(blocks[1].lines, ["Tvrzení."])
  assert.equal(blocks[1].revisedAtLevel, 6)
  assert.equal(blocks[2].type, "revision")
})

test("revize po tajném bloku označí celý tajný blok", () => {
  const blocks = parseBlocks(":::k4\nTajné tvrzení.\n:::\n:::revise6\nNeplatí.\n:::")
  assert.equal(blocks.length, 2)
  assert.equal(blocks[0].type, "secret")
  assert.equal(blocks[0].requiredLevel, 4)
  assert.equal(blocks[0].revisedAtLevel, 6)
  assert.equal(blocks[1].type, "revision")
})

test("revize bez předchozího bloku nic neoznačí", () => {
  const blocks = parseBlocks(":::revise6\nNeplatí.\n:::")
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].type, "revision")
})

test("md blok bez revize nemá revisedAtLevel", () => {
  const blocks = parseBlocks("Tvrzení.")
  assert.equal(blocks[0].revisedAtLevel, undefined)
})
```

- [ ] **Step 2: Spustit testy a ověřit, že selžou**

Run: `node --test lib/`
Expected: FAIL — `:::revise6` se zatím parsuje jako obyčejný text, takže `blocks.find(b => b.type === "revision")` vrátí `undefined`

- [ ] **Step 3: Implementovat**

V `lib/wiki-blocks.ts` nahraď tělo `parseBlocks` tímto:

```ts
const FENCE = /^:::(k|revise)(\d+)\s*$/

/** Odštěpí poslední odstavec (souvislou skupinu neprázdných řádků na konci). */
function splitTrailingParagraph(lines: string[]): [string[], string[]] {
  let end = lines.length
  while (end > 0 && !lines[end - 1].trim()) end--
  if (end === 0) return [lines, []]
  let start = end
  while (start > 0 && lines[start - 1].trim()) start--
  return [lines.slice(0, start), lines.slice(start, end)]
}

export function parseBlocks(content: string): Block[] {
  const rawLines = content.split("\n")
  const blocks: Block[] = []
  let currentMd: string[] = []
  let i = 0

  const flushMd = () => {
    if (currentMd.length) {
      blocks.push({ type: "md", lines: currentMd })
      currentMd = []
    }
  }

  while (i < rawLines.length) {
    const match = rawLines[i].match(FENCE)
    if (match) {
      flushMd()
      const kind = match[1]
      const requiredLevel = parseInt(match[2])
      const body: string[] = []
      i++
      while (i < rawLines.length && rawLines[i].trim() !== ":::") {
        body.push(rawLines[i])
        i++
      }
      if (kind === "k") {
        blocks.push({ type: "secret", requiredLevel, lines: body })
      } else {
        markPrevious(blocks, requiredLevel)
        blocks.push({ type: "revision", requiredLevel, lines: body })
      }
    } else {
      currentMd.push(rawLines[i])
    }
    i++
  }
  flushMd()
  return blocks
}

/** Označí předchozí blok jako revidovaný. U md bloku odštěpí poslední odstavec. */
function markPrevious(blocks: Block[], level: number): void {
  const prev = blocks[blocks.length - 1]
  if (!prev) return
  if (prev.type === "secret") {
    prev.revisedAtLevel = level
    return
  }
  if (prev.type !== "md") return
  const [head, tail] = splitTrailingParagraph(prev.lines)
  if (!tail.length) return
  if (head.length) {
    prev.lines = head
    blocks.push({ type: "md", lines: tail, revisedAtLevel: level })
  } else {
    prev.revisedAtLevel = level
  }
}
```

- [ ] **Step 4: Spustit testy**

Run: `node --test lib/`
Expected: PASS, `# pass 11`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/wiki-blocks.ts lib/wiki-blocks.test.mjs
git commit -m "feat: blok :::reviseN v parseru knihovny"
```

---

## Task 3: Vykreslit revizi a přeškrtnutí

**Files:**
- Modify: `components/shared/wiki-renderer.tsx`

Vzhled:
- Pod úrovní `N` se revizní blok **nevykreslí vůbec** — ani jako černé pruhy. Revize nesmí prozradit, že revize existuje.
- Nad úrovní `N` se vykreslí červeně orámovaný blok s hlavičkou `REVIZE · KAICHI <N>`.
- Blok označený `revisedAtLevel: N` se při `kaichiLevel >= N` vykreslí přeškrtnutě a ztlumeně.

- [ ] **Step 1: Přidat podporu přeškrtnutí do `MdBlock`**

V `components/shared/wiki-renderer.tsx` nahraď `MdBlock` (řádek ~106):

```tsx
function MdBlock({ lines, struck }: { lines: string[]; struck?: boolean }) {
  const body = <>{lines.map((l, i) => renderMdLine(l, i))}</>
  if (!struck) return body
  return (
    <div style={{ textDecoration:"line-through", opacity:0.45 }}>
      {body}
    </div>
  )
}
```

- [ ] **Step 2: Přidat komponentu `RevisionBlock`**

Vlož za `RedactedBlock` (tj. za řádek ~163):

```tsx
function RevisionBlock({ lines, requiredLevel }: { lines: string[]; requiredLevel: number }) {
  return (
    <div style={{
      borderLeft:"2px solid #c0392b", paddingLeft:14,
      backgroundColor:"rgba(192,57,43,0.06)", borderRadius:"0 6px 6px 0",
      padding:"10px 14px", margin:"10px 0",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
        <span style={{
          width:18, height:18, borderRadius:"50%",
          border:"1px solid #c0392b", backgroundColor:"#1a0000",
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          fontSize:"0.5rem", color:"#c0392b", fontFamily:"monospace", fontWeight:700, flexShrink:0,
        }}>
          {romanNumeral(requiredLevel)}
        </span>
        <span style={{ fontSize:"0.65rem", color:"#c0392b", letterSpacing:"0.1em" }}>
          REVIZE · KAICHI {romanNumeral(requiredLevel)}
        </span>
      </div>
      <MdBlock lines={lines} />
    </div>
  )
}
```

- [ ] **Step 3: Přepsat `WikiRenderer`**

Nahraď celou funkci `WikiRenderer` (řádek ~165 do konce souboru):

```tsx
export function WikiRenderer({ content, kaichiLevel }: Props) {
  const blocks = parseBlocks(content)
  return (
    <div>
      {blocks.map((block, i) => {
        if (block.type === "revision") {
          if (kaichiLevel < block.requiredLevel) return null
          return <RevisionBlock key={i} lines={block.lines} requiredLevel={block.requiredLevel} />
        }
        const struck = block.revisedAtLevel != null && kaichiLevel >= block.revisedAtLevel
        if (block.type === "md") {
          return <MdBlock key={i} lines={block.lines} struck={struck} />
        }
        return (
          <RedactedBlock
            key={i}
            lines={block.lines}
            requiredLevel={block.requiredLevel}
            unlocked={kaichiLevel >= block.requiredLevel}
            struck={struck}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Přidat `struck` do `RedactedBlock`**

V `RedactedBlock` rozšiř signaturu a předej dál do `MdBlock`:

```tsx
function RedactedBlock({ lines, requiredLevel, unlocked, struck }: {
  lines: string[]; requiredLevel: number; unlocked: boolean; struck?: boolean
}) {
```

a uvnitř větve `if (unlocked)` nahraď `<MdBlock lines={lines} />` za `<MdBlock lines={lines} struck={struck} />`.

- [ ] **Step 5: Ověřit build**

Run: `npx next build`
Expected: build proběhne bez chyb

- [ ] **Step 6: Commit**

```bash
git add components/shared/wiki-renderer.tsx
git commit -m "feat: vykreslení revizního bloku a přeškrtnutí"
```

---

## Task 4: Vytáhnout knihovnu do sdíleného panelu

**Files:**
- Create: `components/panels/wiki.tsx`
- Modify: `components/views/student-dashboard.tsx`

- [ ] **Step 1: Vytvořit `components/panels/wiki.tsx`**

Panel si načítá data sám podle `characterId`. `kaichiLevel` dostává zvenčí, protože API vrací jen články, ne úroveň.

```tsx
"use client"

import React, { useCallback, useEffect, useState } from "react"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
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
        const data: WikiArticle[] = await res.json()
        setArticles(data)
        if (data.length > 0) setOpenCategories(new Set([data[0].category]))
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

  if (loading) return <div style={{ padding:20, color:"var(--c-text-muted)" }}>Načítám…</div>
  if (articles.length === 0) return <div style={{ padding:20, color:"var(--c-text-muted)" }}>Žádné dostupné záznamy.</div>

  const categories = [...new Set(articles.map(a => a.category))]

  return (
    <div>
      {categories.map(cat => {
        const catArticles = articles.filter(a => a.category === cat)
        const isOpen = openCategories.has(cat)
        return (
          <div key={cat} style={{
            border:"1px solid var(--c-border)", borderRadius:8,
            marginBottom:10, overflow:"hidden",
          }}>
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
                  : <IconChevronRight size={16} color="var(--c-text-muted)" />}
              </div>
            </button>

            {isOpen && (
              <div style={{ borderTop:"1px solid var(--c-border)" }}>
                {catArticles.map((article, idx) => {
                  const isArticleOpen = expanded === String(article.id)
                  return (
                    <div key={article.id} style={{ borderTop: idx > 0 ? "1px solid var(--c-border)" : undefined }}>
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
                          : <IconChevronRight size={14} color="var(--c-text-muted)" />}
                      </button>
                      {isArticleOpen && (
                        <div style={{ padding:"16px 28px 24px 28px", borderTop:"1px solid var(--c-border)" }}>
                          <WikiRenderer content={article.content} kaichiLevel={kaichiLevel} />
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

- [ ] **Step 2: Zjednodušit `student-dashboard.tsx`**

Smaž z `student-dashboard.tsx`:

- stavy `wikiArticles`, `wikiLoading`, `wikiExpanded`, `openCategories` (řádky ~44–47)
- funkci `loadWiki` (~66–82)
- proměnnou `wikiCategories` (~88)
- funkci `toggleCategory` (~90)
- importy `WikiRenderer` a typu `WikiArticle` — po přesunu je nic nepoužívá
- z importu `react` odstraň `useCallback`, pokud ho nepoužívá nic jiného

**Ponech** import `IconBooks` — používá se v poli tabů.

Přidej import:

```tsx
import { WikiPanel } from "@/components/panels/wiki"
```

Z `TabsTrigger` odstraň `onClick={v === "wiki" ? loadWiki : undefined}` — panel se načítá sám.

Celý `<TabsContent value="wiki">` nahraď za:

```tsx
<TabsContent value="wiki">
  <WikiPanel characterId={student.id} kaichiLevel={student.kaichiLevel ?? 0} />
</TabsContent>
```

- [ ] **Step 3: Ověřit build a chování**

Run: `npx next build`
Expected: build bez chyb, žádné varování o nepoužitých importech

Run: `npm run dev`, přihlas se jako student, otevři tab „Informace".
Expected: kategorie se rozbalují, články se otevírají, utajené bloky se chovají podle kaichi

- [ ] **Step 4: Commit**

```bash
git add components/panels/wiki.tsx components/views/student-dashboard.tsx
git commit -m "refactor: knihovna do sdíleného WikiPanel"
```

---

## Task 5: Knihovna v učitelském dashboardu

**Files:**
- Modify: `components/views/teacher-dashboard.tsx`

Učitel je postava jako každá jiná — potřebuje svoje `id` a `kaichiLevel` z game contextu.

- [ ] **Step 1: Přidat importy a přístup k postavě**

V `components/views/teacher-dashboard.tsx` doplň importy:

```tsx
import { IconBooks } from "@tabler/icons-react"
import { useGame } from "@/lib/game-context"
import { WikiPanel } from "@/components/panels/wiki"
```

Na začátek `TeacherDashboard` přidej:

```tsx
const { currentUser, characters } = useGame()
const teacher = characters.find(c => c.id === currentUser?.id)
```

- [ ] **Step 2: Přidat tab do seznamu**

V poli tabů (řádky ~51–55) přidej položku za `["alarm","Alarm",IconBell],`:

```tsx
["wiki","Informace",IconBooks],
```

- [ ] **Step 3: Přidat obsah tabu**

Za `<TabsContent value="alarm"><AlarmPanel /></TabsContent>` přidej:

```tsx
<TabsContent value="wiki">
  {teacher
    ? <WikiPanel characterId={teacher.id} kaichiLevel={teacher.kaichiLevel ?? 0} />
    : <div style={{ padding:20, color:"var(--c-text-muted)" }}>Postava nenalezena.</div>}
</TabsContent>
```

- [ ] **Step 4: Ověřit**

Run: `npx next build`
Expected: build bez chyb

Run: `npm run dev`, přihlas se jako učitel (kód `TCH-001`), otevři „Informace".
Expected: knihovna se načte se stejným obsahem, ale hlubší vrstvy odemčené podle učitelova kaichi

- [ ] **Step 5: Commit**

```bash
git add components/views/teacher-dashboard.tsx
git commit -m "feat: knihovna v učitelském dashboardu"
```

---

## Task 6: Opravit kaichi úrovně podle kánonu

**Files:**
- Modify: `lib/data.ts`

Kánon (spec, K4): Kaichi 0 neexistuje. Studenti II–IV. Učitelé V–VII. GM a obrazovky nediegetické, zůstávají na 0.

- [ ] **Step 1: Nastavit učitelům kaichi**

V `lib/data.ts` (řádky 55–66) změň `kaichiLevel:0` na následující hodnoty. Rozdělení: ředitel a velení výš, řadoví učitelé níž.

```ts
  // ── Učitelé ──
  { id:"TCH6", code:"TCH-006",  name:"Arakami",   role:"teacher",
    circleIds:[], kaichiLevel:7, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH1", code:"TCH-001",  name:"Shiranagi", role:"teacher",
    circleIds:[], kaichiLevel:6, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH2", code:"TCH-002",  name:"Nakamura",  role:"teacher",
    circleIds:[], kaichiLevel:6, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH3", code:"TCH-003",  name:"Ibuki",     role:"teacher",
    circleIds:[], kaichiLevel:5, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH4", code:"TCH-004",  name:"Karasu",    role:"teacher",
    circleIds:[], kaichiLevel:5, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
  { id:"TCH5", code:"TCH-005",  name:"Okuda",     role:"teacher",
    circleIds:[], kaichiLevel:6, points:0, peerPointPool:0, lessonClaimedThisWindow:false },
```

- [ ] **Step 2: Opravit studenty mimo rozsah II–IV**

Změň `kaichiLevel` u čtyř studentů:

- `S012` (Ren, „Nezlomný") — z `1` na `2`
- `S024` (Haruka, „Chudinka") — z `1` na `2`
- `S007` (Ikai, „Vůdkyně") — z `5` na `4`
- `S019` (Shiho, „Kapitánka") — z `5` na `4`

- [ ] **Step 3: Ověřit, že žádný student nemá kaichi mimo II–IV**

Run:
```bash
grep -A2 'role:"student"' lib/data.ts | grep -o 'kaichiLevel:[0-9]*' | sort | uniq -c
```
Expected: pouze `kaichiLevel:2`, `kaichiLevel:3`, `kaichiLevel:4`

Run:
```bash
grep -o 'kaichiLevel:0' lib/data.ts | wc -l
```
Expected: `3` — pouze GM1, DSP1, DSP2

- [ ] **Step 4: Commit**

```bash
git add lib/data.ts
git commit -m "fix: kaichi úrovně podle kánonu, kaichi 0 jen u nediegetických rolí"
```

---

## Task 7: Nahradit placeholdery skutečným obsahem

**Files:**
- Modify: `app/api/admin/seed-wiki/route.ts`

Nahraď **celé** pole `ARTICLES` (řádky 5–407) níže uvedeným. Funkce `POST` na řádcích 409–423 zůstává beze změny.

- [ ] **Step 1: Přepsat pole `ARTICLES`**

```ts
const ARTICLES = [
  // ─── ŘÁD A SPOLEČNOST ──────────────────────────────────────────────────────
  {
    slug: "system-kaichi",
    title: "Systém Kaichi",
    category: "Řád a společnost",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Systém Kaichi

**Kaichi** (階知 — *úroveň poznání*) je formálně uznaná struktura pravdy. Určuje, jak hluboko jednotlivec rozumí skutečnému fungování světa a společnosti. Stát její existenci nepopírá ani neskrývá. Poznání je zdroj a se zdroji se hospodaří.

---

## Stupně

- **Kaichi I** — 第一階知 *Dai Ichi Kaichi* — nárok dosažením 10 let
- **Kaichi II** — 第二階知 *Dai Ni Kaichi* — nárok dosažením 15 let
- **Kaichi III** — 第三階知 *Dai San Kaichi* — nárok dosažením 18 let
- **Kaichi IV** — 第四階知 *Dai Shi Kaichi* — mimořádná služba režimu
- **Kaichi V** — 第五階知 *Dai Go Kaichi* — dokončení Akademie
- **Kaichi VI** — 第六階知 *Dai Roku Kaichi* — vstup do důvěrných struktur: výzkum, velení, Lovci
- **Kaichi VII** — 第七階知 *Dai Nana Kaichi* — přijetí mezi strategické plánovače

První tři stupně jsou nárokové. Nikdo o ně nežádá a nikdo je neuděluje — přicházejí s věkem, protože poznání má svůj čas. Od čtvrtého stupně výše se Kaichi zasluhuje.

Přístup na stupeň zahrnuje všechny předchozí. Stupně lze přeskakovat.

---

## Závazky

Každý stupeň přináší porozumění a s ním závazek. Držitel Kaichi nesdílí obsah svého stupně s nikým, kdo ho nedosáhl. Není to zákaz mluvení. Je to ochrana toho, kdo není připraven.

Znalost se ověřuje. Zkoušky loajality probíhají pravidelně a jejich součástí je detektor lži.

> *Kdo unese pravdu, unese i její váhu. Kdo ji neunese, ublíží sobě i druhým.*

:::k7
Kaichi není nástroj vzdělávání. Je to nástroj stability.

Člověk, který ztratí řád a smysl, se mění v monstrum. Pravda podaná dřív, než na ni má člověk strukturu, řád ničí — a ničí tím i člověka. Stupňování poznání proto není opatrnost ani mocenský nástroj. Je to jediná známá prevence.

Uspořádání společnosti, které mnozí považují za tvrdé, není omyl ani přežitek. Je to nejlepší dostupné řešení a bylo zvoleno vědomě.
:::

:::k8
Veřejně se uznává sedm stupňů. Osmý existuje a zní:

**Měsíc je tělo mrtvého monstra.** Junkin, na němž stojí celá civilizace, se těží z mrtvoly.
:::`,
  },

  // ─── LOVCI ─────────────────────────────────────────────────────────────────
  {
    slug: "lovci",
    title: "Lovci",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Lovci

**Lovci** (猟士 — *Ryōshi*) jsou elitní kasta občanů Shin Junkinu. Jejich úkolem je vyhledávat a likvidovat monstra. Všechno ostatní z toho plyne.

---

## Postavení

- Stojí nad běžným zákonem. Řídí se vlastními pravidly a soudí je jen jiní lovci.
- Mají doživotní rentu, menší i pro své blízké. Při smrti ve službě se zvyšuje.
- Mají nárok na vyšší stupně Kaichi. Ne výlučně, ale službou.

Rudý plášť je symbol přísahy. Po smrti se vrací rodině jako relikvie.

---

## Řád

Lovce sdružuje **Ústřední lovecký řád** (中央猟士団 — *Chūō Ryōshi-dan*), zkráceně **Ryōdan**. Uděluje licence, přiděluje mise, vede soud.

Rozhoduje demokraticky — každý lovec má jeden hlas — ale běžná rozhodnutí dělá volený **Nejvyšší koncil**.

Ryōdan je samostatná mocenská instituce s monopolem na lov. Stát nad ním drží dohled rozpočtem, vyhrazenými místy v koncilu a existencí armády jako protiváhy. Napětí mezi řádem a státem je trvalé a je záměrné.

---

## Trojice

Lovci pracují výhradně po trojicích. Vycvičit jednoho lovce k plné samostatnosti trvá déle, než si obnovující se civilizace mohla dovolit. Trojice byla řešením.

:::k5
Trojice není doporučení. Bez kompletní trojice není akreditace.

Když se trojice rozpadne — smrtí, zraněním, vyloučením — lovecká kariéra zbylých dvou obvykle končí. Nabízí se přechod do armády, štábní role v Řádu, vzácně přidělení ke Stínům. Spojení dvou neúplných trojic je výjimka, ne pravidlo.
:::

---

## Závazky

Lovec nesmí mít trvalý partnerský vztah ani rodinu. Pravidlo vzniklo po případu Jestřába a od té doby se nezměnilo.

:::k5
Není to pravidlo, které by šlo porušit.

Při ukončení Akademie podstupuje každý budoucí lovec zákrok, který mu trvale odebírá schopnost mít děti. Veřejnost i většina lovců věří, že jde o závazek, o slib. Nejde. Rozhodnutí padlo za ně a je nevratné.

Příběhy o lovcích, kteří se vrátili k milující rodině, jsou vyfabrikované. Všechny.
:::`,
  },
  {
    slug: "navrat",
    title: "Návrat",
    category: "Lovci",
    kaichi_required: 0,
    sort_order: 2,
    content: `# Návrat

Mezi lovci se hovoří o **Návratu**. Podrobnosti podléhají čtvrtému stupni poznání.

:::k4
Přeměna člověka v monstrum není nevratná. Existuje postup, jak monstru vrátit původní význam a s ním i lidskou podobu.

Postup je krajně náročný a nelze ho opakovat. Každý akreditovaný lovec má za celou svou službu **jeden Návrat**. Jednou, kdykoli během kariéry, na kohokoli, bez zdůvodnění Řádu.

Většina lovců ho nepoužije nikdy. Někteří si ho schovávají pro někoho konkrétního. Rozhodnutí je jejich a nikdo je nepřezkoumává.
:::

:::revise6
Návrat neexistuje. Nikdy neexistoval. Nebyl vyvinut, nebyl vyzkoušen a žádný lovec ho nikdy neuplatnil.

Informace o Návratu je řízené opatření schválené Nejvyšším koncilem. Slouží k tomu, aby lovec vydržel. Naděje na jediný možný zvrat udrží člověka ve službě tam, kde by jinak selhal — a udržela jich už mnoho.

Dozvídáš se to, protože jsi lovec. Ostatní tomu věří dál. Nech je.
:::`,
  },

  // ─── MONSTRA ───────────────────────────────────────────────────────────────
  {
    slug: "miasma",
    title: "Miasma",
    category: "Monstra",
    kaichi_required: 0,
    sort_order: 1,
    content: `# Miasma

**Miasma** je látka spojená s monstry. Chová se jako neviditelná mlha, ale nechová se jako plyn — nelze ji odvětrat, rozehnat ani zředit. Ničí tělo i mysl.

Každá lovecká výprava je povinně vybavena maskou a filtrem. Bez výjimky.

---

## Výskyt

- Některá monstra ji uvolňují neustále, jiná cíleně jako útok nebo zastrašení.
- Na místech dlouhodobého výskytu monster vznikají **zamořené zóny**. Vstup bez ochrany je smrtelný.
- Zóny jsou značené. Značení se nepřekračuje.

---

## Stupně nákazy

1. **Bez projevu** — žádné příznaky
2. **Lehké** — občasné zakašlání, točení hlavy, nevyrovnaná nálada
3. **Střední** — trvalý kašel, malátnost, kolaps při zátěži, výbuchy vzteku a pláče. Nutná léčba.
4. **Těžké** — krvácení z očí a jiných otvorů, paranoia, extrémní nestabilita. Nezbytná intenzivní léčba.
5. **Konečné** — selhávání organismu, rozklad osobnosti a mysli

Nižší stupně odeznívají samy, pomalu a s odpočinkem. Vyšší ne.

---

## Manipulace

Sbírat a skladovat miasmu smějí výhradně státní instituce a Ústřední lovecký řád. Jakákoli jiná manipulace se stíhá jako příprava biologické zbraně.

:::k3
Miasma je surovinou detektoru lži.

Její neurotoxický účinek krátkodobě otupuje mysl. Subjekt je vnímavější a méně schopný klamu. Jedna dávka odpovídá jedné otázce.

Proto se detektor lži nepoužívá plošně a nelze se jím denně ptát každého. Není to opatrnost. Je to spotřeba.
:::`,
  },
]
```

- [ ] **Step 2: Ověřit build**

Run: `npx next build`
Expected: build bez chyb

- [ ] **Step 3: Naseedovat databázi**

⚠️ `POST /api/admin/seed-wiki` provádí `DELETE FROM wiki_articles` — smaže všechny stávající články včetně případných úprav z GM panelu. Před ostrým během hry neseedovat.

Run: `npm run dev` a v jiném terminálu:
```bash
curl -X POST http://localhost:3000/api/admin/seed-wiki
```
Expected: `{"ok":true,"inserted":4}`

- [ ] **Step 4: Ověřit vrstvení v prohlížeči**

Přihlas se postupně jako:

| Kód | Kaichi | Co musí platit |
|---|---|---|
| `STU-012` | II | *Návrat* má jen úvodní větu a jeden blok černých pruhů. Revize se nezobrazuje vůbec. |
| `STU-010` | II | V *Miasmě* je blok o detektoru lži zamčený |
| `STU-002` | III | V *Miasmě* je blok o detektoru lži odemčený |
| `STU-001` | IV | V *Návratu* je text o Návratu odemčený, revize stále neviditelná |
| `TCH-003` | V | V *Lovcích* odemčené oba bloky o trojicích a rodině |
| `TCH-001` | VI | V *Návratu* je text o Návratu **přeškrtnutý** a pod ním červený blok `REVIZE · KAICHI VI` |
| `TCH-006` | VII | V *Systému Kaichi* odemčený blok o stabilitě. Blok Kaichi VIII stále zamčený. |

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/seed-wiki/route.ts
git commit -m "feat: skutečný obsah knihovny, fáze 1 — Kaichi, Lovci, Návrat, Miasma"
```

---

## Otevřené k rozhodnutí

Během psaní článků vznikly dvě věci, které spec neurčuje. Ani jedna neblokuje fázi 1, ale obě potřebují rozhodnutí, než se napíše fáze 2.

1. **Rozkaz o konečném stupni nákazy.** Zdroj (*Miasma*) říká: „Obecná znalost je že člověk v tomhle stavu umírá, ale není to pravda, zdravotníci mají rozkaz zabít člověka v této fázi." Tohle tajemství není v mapě Kaichi I–VIII. V článku *Miasma* zatím **není** — nechtěl jsem tiše přidávat kánon. Nabízí se Kaichi V, ale je to volba, ne odvození.

2. **Rozdělení kaichi mezi učitele.** Task 6 dává TCH1/2/5 → VI, TCH3/4 → V, TCH6 → VII. Je to odhad podle toho, že Arakami je uveden první. Skutečné rozdělení má vycházet z postav v doku *Vedlejší postavy*, ne z pořadí v poli.
