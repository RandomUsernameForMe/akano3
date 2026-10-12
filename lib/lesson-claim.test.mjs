import { test } from "node:test"
import assert from "node:assert/strict"
import { canClaimLesson } from "./lesson-claim.ts"

const now = new Date("2026-10-13T10:00:00Z")
const future = new Date("2026-10-13T10:30:00Z")
const past = new Date("2026-10-13T09:00:00Z")

test("aktivní nevypršelé neuplatněné okno lze uplatnit", () => {
  assert.equal(canClaimLesson({ windowActive: true, windowEnd: future, alreadyClaimed: false }, now), true)
})

test("už uplatněný claim nelze uplatnit znovu", () => {
  assert.equal(canClaimLesson({ windowActive: true, windowEnd: future, alreadyClaimed: true }, now), false)
})

test("neaktivní okno nelze uplatnit", () => {
  assert.equal(canClaimLesson({ windowActive: false, windowEnd: future, alreadyClaimed: false }, now), false)
})

test("okno s koncem v minulosti nelze uplatnit", () => {
  assert.equal(canClaimLesson({ windowActive: true, windowEnd: past, alreadyClaimed: false }, now), false)
})

test("aktivní okno bez konce nelze uplatnit", () => {
  assert.equal(canClaimLesson({ windowActive: true, windowEnd: null, alreadyClaimed: false }, now), false)
})
