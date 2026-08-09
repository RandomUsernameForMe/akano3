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
