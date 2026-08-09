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

// Zjištěno při code review Tasku 1. Vnořené fence parser neumí a nikdy neuměl —
// vnitřní fence zůstane jako doslovný text a osiřelý zavírací :::  se vykreslí.
// Test tohle chování zaznamenává, aby se změna neprovedla omylem.
test("vnořený fence se nezpracuje, zůstane doslovným textem", () => {
  const blocks = parseBlocks(":::k3\nA\n:::k5\nB\n:::\nC\n:::")
  assert.equal(blocks.length, 2)
  assert.equal(blocks[0].type, "secret")
  assert.equal(blocks[0].requiredLevel, 3)
  assert.deepEqual(blocks[0].lines, ["A", ":::k5", "B"])
  assert.equal(blocks[1].type, "md")
  assert.deepEqual(blocks[1].lines, ["C", ":::"])
})

// Dvě revize za sebou: druhá nemá co označit, protože předchozí blok je revision.
// Tiše nic neoznačí. Je to chyba autora článku, ne parseru — test to drží na místě,
// aby budoucí úprava nezačala omylem revidovat revizi nebo revidovat dvakrát totéž.
test("druhá revize v řadě nic neoznačí", () => {
  const blocks = parseBlocks("A\n:::revise3\nX\n:::\n:::revise4\nY\n:::")
  assert.equal(blocks.length, 3)
  assert.equal(blocks[0].type, "md")
  assert.equal(blocks[0].revisedAtLevel, 3)
  assert.equal(blocks[1].type, "revision")
  assert.equal(blocks[1].requiredLevel, 3)
  assert.equal(blocks[2].type, "revision")
  assert.equal(blocks[2].requiredLevel, 4)
})

// Zjištěno při ruční verifikaci Tasku 3. Prázdný řádek mezi zavírajícím ::: tajného
// bloku a :::reviseN (běžné kvůli čitelnosti zdroje) by bez téhle opravy vytvořil
// osiřelý prázdný md blok, na který by se revize navázala místo na secret blok —
// secret by pak zůstal neoznačený a nikdy by se nepřeškrtl.
test("prázdný řádek mezi tajným blokem a revizí revizi nezmate", () => {
  const blocks = parseBlocks(":::k4\nA\n:::\n\n:::revise6\nB\n:::")
  assert.equal(blocks.length, 2)
  assert.equal(blocks[0].type, "secret")
  assert.equal(blocks[0].requiredLevel, 4)
  assert.equal(blocks[0].revisedAtLevel, 6)
  assert.equal(blocks[1].type, "revision")
  assert.equal(blocks[1].requiredLevel, 6)
})
