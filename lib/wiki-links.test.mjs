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
