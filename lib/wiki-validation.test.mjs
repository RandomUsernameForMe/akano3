import { test } from "node:test"
import assert from "node:assert/strict"
import { validateWikiArticleInput, parseKaichiLevel } from "./wiki-validation.ts"

const valid = { slug: "a", title: "A", content: "text", category: "", kaichiRequired: 3, sortOrder: 0 }

test("platný článek projde", () => {
  assert.deepEqual(validateWikiArticleInput(valid), { ok: true, value: valid })
})

test("neplatný článek vrátí chybu", () => {
  const bad = [
    null,
    { ...valid, slug: "" },
    { ...valid, slug: "  " },
    { ...valid, title: undefined },
    { ...valid, kaichiRequired: 9 },
    { ...valid, kaichiRequired: -1 },
    { ...valid, kaichiRequired: "x" },
    { ...valid, kaichiRequired: 2.5 },
    { ...valid, sortOrder: "abc" },
  ]
  for (const b of bad) assert.equal(validateWikiArticleInput(b).ok, false)
})

test("parseKaichiLevel odmítne nečíselné a necelé hodnoty", () => {
  for (const v of ["abc", 3.7, undefined, NaN, ""]) assert.equal(parseKaichiLevel(v).ok, false)
})

test("parseKaichiLevel přijme čísla a ořeže rozsah", () => {
  assert.deepEqual(parseKaichiLevel(3), { ok: true, value: 3 })
  assert.deepEqual(parseKaichiLevel("5"), { ok: true, value: 5 })
  assert.deepEqual(parseKaichiLevel(12), { ok: true, value: 8 })
  assert.deepEqual(parseKaichiLevel(-2), { ok: true, value: 0 })
})
