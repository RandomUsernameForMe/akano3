#!/usr/bin/env node
// Kontrola stylových rozpočtů článků herní knihovny.
// Pravidla a odůvodnění: docs/styl-knihovny.md
//
// Použití:  node scripts/wiki-styl.mjs
// Výstup:   report po článcích + souhrn; exit 1 při překročení rozpočtu.

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SEED = resolve(ROOT, "app/api/admin/seed-wiki/route.ts")

const STRUKTURNI = /^(#|-|>|\||:::|\d+\.)/
// Řádek uvozený tučným štítkem (`**Dnes:** …`) je datové pole, ne věta v odstavci.
const POLE = /^\*\*[^*]+\*\*:?\s/

function articles() {
  const src = readFileSync(SEED, "utf8")
  return [...src.matchAll(/title: "([^"]+)",[\s\S]*?content: `([\s\S]*?)`,\n {2}\},/g)]
    .map(m => ({ title: m[1], body: m[2] }))
}

/** Řádky, které nesou prózu — bez nadpisů, odrážek, citací a fence. */
function prosaicLines(body) {
  return body.split("\n").map(l => l.trim()).filter(l => l && !STRUKTURNI.test(l))
}

// ── Pravidla ───────────────────────────────────────────────────────────────
// limit 0 = zakázáno úplně. Vyšší číslo = rozpočet na celou knihovnu.

const PRAVIDLA = [
  { nazev: "komentář textu o sobě", limit: 0,
    re: /(Tohle|To) je (celé |celá |skutečn\w+ |ten |ta )?(jádro|důvod|pointa|podstata|vysvětlení)/g },
  { nazev: "předjímání námitek", limit: 0,
    re: /Není to (opomenutí|náhoda|omyl|přehmat|chyba)/g },
  { nazev: "rámování sebe sama", limit: 0,
    re: /(to je|je to) (zároveň )?(všechno|vše),? co (je|se)/gi },
  { nazev: "vágní zesilovač", limit: 0,
    re: /\b(zoufale|krajně|nesmírně|naprost\w+ většin\w+)\b/gi },
  { nazev: "antiteze „Není to X, je to Y\"", limit: 5,
    re: /\b(Není to|není to|Nejde o|nejde o|Ne proto)\b/g },
  { nazev: "kurzívní aforismus v blockquote", limit: 8, re: /^> \*/gm },
  { nazev: "oslovení čtenáře", limit: 3,
    re: /\b(Jsi|jsi|tvoj\w+|Tvoj\w+|tvůj|Tvůj)\b/g },
  { nazev: "„obvykle\" jako náznak", limit: 2, re: /\bobvykle\b/gi },
  // Em-dash se počítá jen v próze. V odrážkách odděluje termín od popisu
  // (`**F** — fyzický`) a v glosách japonských výrazů — tam to není pauza.
  { nazev: "em-dash jako pauza v próze", limit: 30,
    count: b => prosaicLines(b).reduce((s, l) => s + (l.match(/—/g)?.length ?? 0), 0) },
  // Krátká věta vadí, když odstavec UKONČUJE nebo stojí samostatně po próze —
  // tam zpravidla jen shrnuje, co si čtenář právě přečetl, nebo dělá pointu.
  // Nevadí hned pod nadpisem nebo na začátku bloku: tam uvozuje téma.
  { nazev: "krátká úderná věta na konci odstavce", limit: 5,
    count: b => {
      const lines = b.split("\n")
      let n = 0
      lines.forEach((raw, i) => {
        const l = raw.trim()
        if (!l || STRUKTURNI.test(l) || POLE.test(l)) return
        if (!/[.!?]$/.test(l) || l.split(/\s+/).length > 8) return
        const dalsi = (lines[i + 1] ?? "").trim()
        const konec = dalsi === "" || dalsi === ":::" || i === lines.length - 1
        // Uvození: nejbližší předchozí neprázdný řádek je nadpis nebo fence.
        let j = i - 1
        while (j >= 0 && lines[j].trim() === "") j--
        const uvozeni = j < 0 || STRUKTURNI.test(lines[j].trim())
        if (konec && !uvozeni) n++
      })
      return n
    } },
  { nazev: "článek delší než 2600 znaků", limit: 0,
    count: b => (b.length > 2600 ? 1 : 0) },
]

// ── Vyhodnocení ────────────────────────────────────────────────────────────

const clanky = articles()
let selhalo = 0

console.log(`Kontrola stylu — ${clanky.length} článků, ${clanky.reduce((s, a) => s + a.body.length, 0).toLocaleString("cs")} znaků\n`)

for (const p of PRAVIDLA) {
  const perClanek = clanky
    .map(a => [a.title, p.count ? p.count(a.body) : (a.body.match(p.re)?.length ?? 0)])
    .filter(([, n]) => n > 0)
  const celkem = perClanek.reduce((s, [, n]) => s + n, 0)
  const ok = celkem <= p.limit
  if (!ok) selhalo++

  const znak = ok ? "✓" : "✗"
  const misto = p.limit === 0 ? "zakázáno" : `${celkem}/${p.limit}`
  console.log(`${znak} ${p.nazev.padEnd(42)} ${String(celkem).padStart(4)}  ${ok ? "" : `(${misto})`}`)
  if (!ok) for (const [t, n] of perClanek.sort((a, b) => b[1] - a[1])) console.log(`      ${t} ×${n}`)
}

console.log(selhalo ? `\n${selhalo} pravidel překročeno.` : "\nVšechna pravidla splněna.")
process.exit(selhalo ? 1 : 0)
