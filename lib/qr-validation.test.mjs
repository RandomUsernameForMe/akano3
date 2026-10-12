import test from "node:test"
import assert from "node:assert/strict"
import { parseQrBody } from "./qr-validation.ts"

const valid = { label: "Bonus", targetType: "team", targetId: "T01", points: 10, validity: "once" }
const bad = (patch) => parseQrBody({ ...valid, ...patch }).ok

test("platný vstup", () => {
  assert.deepEqual(parseQrBody(valid), { ok: true, value: valid })
})

test("student, záporné body, validUntil a oříznutý label", () => {
  const r = parseQrBody({ ...valid, label: "  Trest ", targetType: "student", targetId: "S001", points: -5, validity: "timed", validUntil: "2026-10-12T10:00:00Z" })
  assert.equal(r.ok, true)
  assert.equal(r.value.label, "Trest")
  assert.equal(r.value.validUntil, "2026-10-12T10:00:00Z")
})

test("validUntil null je povolené", () => {
  assert.equal(bad({ validUntil: null }), true)
})

test("label", () => {
  assert.equal(bad({ label: "" }), false)
  assert.equal(bad({ label: "   " }), false)
  assert.equal(bad({ label: 5 }), false)
  assert.equal(bad({ label: undefined }), false)
})

test("targetType", () => {
  assert.equal(bad({ targetType: "toString" }), false)
  assert.equal(bad({ targetType: "foo" }), false)
  assert.equal(bad({ targetType: 1 }), false)
})

test("targetId", () => {
  assert.equal(bad({ targetId: "NOPE" }), false)
  assert.equal(bad({ targetId: 1 }), false)
  assert.equal(bad({ targetId: undefined }), false)
})

test("points", () => {
  for (const points of [0, 1.5, "5", NaN, undefined]) assert.equal(bad({ points }), false)
})

test("validity", () => {
  assert.equal(bad({ validity: "forever" }), false)
  assert.equal(bad({ validity: "toString" }), false)
  assert.equal(bad({ validity: 1 }), false)
})

test("validUntil", () => {
  assert.equal(bad({ validUntil: "nesmysl" }), false)
  assert.equal(bad({ validUntil: 12345 }), false)
})

test("body není objekt", () => {
  assert.equal(parseQrBody(null).ok, false)
  assert.equal(parseQrBody("x").ok, false)
})
