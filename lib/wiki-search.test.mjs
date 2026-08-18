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
