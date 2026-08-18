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
