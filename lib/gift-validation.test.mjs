import { test } from "node:test"
import assert from "node:assert/strict"
import { validateGift } from "./gift-validation.ts"

const chars = [
  { id: "gm", role: "gm" },
  { id: "t1", role: "teacher" },
  { id: "s1", role: "student", teamId: "a" },
  { id: "s2", role: "student", teamId: "b" },
  { id: "r1", role: "ruze", teamId: "a" },
]

test("dar sám sobě vrací chybu", () => {
  assert.ok(validateGift("s1", "s1", 1, chars))
})

test("neexistující postava vrací chybu", () => {
  assert.ok(validateGift("nope", "s2", 1, chars))
  assert.ok(validateGift("s1", "nope", 1, chars))
})

test("dárce GM nebo učitel vrací chybu", () => {
  assert.ok(validateGift("gm", "s2", 1, chars))
  assert.ok(validateGift("t1", "s2", 1, chars))
})

test("neplatný amount vrací chybu", () => {
  for (const a of [0, -5, 1.5, NaN]) assert.ok(validateGift("s1", "s2", a, chars))
})

test("platný dar student → student projde", () => {
  assert.equal(validateGift("s1", "s2", 3, chars), null)
})

test("růže může darovat", () => {
  assert.equal(validateGift("r1", "s2", 1, chars), null)
})
