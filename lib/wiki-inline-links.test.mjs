import { test } from "node:test"
import assert from "node:assert/strict"
import { parseInlineLinks } from "./wiki-inline-links.ts"

test("odkazy s labelem i bez se rozpadnou na segmenty", () => {
  assert.deepEqual(parseInlineLinks("Viz [[k1-akademie|Akademie]] a [[k2]]."), [
    { type: "text", text: "Viz " },
    { type: "link", slug: "k1-akademie", label: "Akademie" },
    { type: "text", text: " a " },
    { type: "link", slug: "k2", label: "k2" },
    { type: "text", text: "." },
  ])
})

test("neuzavřené [[ zůstane textem", () => {
  assert.deepEqual(parseInlineLinks("a [[b"), [{ type: "text", text: "a [[b" }])
})

test("prázdné [[]] zůstane textem", () => {
  assert.deepEqual(parseInlineLinks("x [[]] y"), [{ type: "text", text: "x [[]] y" }])
})

test("text bez odkazů a prázdný vstup", () => {
  assert.deepEqual(parseInlineLinks("nic"), [{ type: "text", text: "nic" }])
  assert.deepEqual(parseInlineLinks(""), [])
})
