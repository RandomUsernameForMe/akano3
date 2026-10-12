import { test } from "node:test"
import assert from "node:assert/strict"
import { parseDurationMin, validateLessonBody, validateConfigBody } from "./request-validation.ts"

const chars = ["a", "b"]
const ids = { teamIds: ["t1"], unitIds: ["u1"], circleIds: ["c1"], characterIds: chars }

test("parseDurationMin: neplatné hodnoty", () => {
  for (const v of [-5, 0, NaN, Infinity, "30", null]) assert.equal(parseDurationMin(v), null)
})

test("parseDurationMin: default a platná hodnota", () => {
  assert.equal(parseDurationMin(undefined), 30)
  assert.equal(parseDurationMin(45), 45)
})

test("lesson toggle: durationMin", () => {
  for (const d of [-1, 0, NaN, "x"]) {
    assert.ok(validateLessonBody({ action: "toggle", active: true, durationMin: d }, chars))
  }
  assert.equal(validateLessonBody({ action: "toggle", active: true }, chars), null)
  assert.equal(validateLessonBody({ action: "toggle", active: true, durationMin: 10 }, chars), null)
  assert.equal(validateLessonBody({ action: "toggle", active: false }, chars), null)
  assert.ok(validateLessonBody({ action: "toggle", active: "yes" }, chars))
})

test("lesson: neznámá akce a neplatné body", () => {
  assert.ok(validateLessonBody({ action: "nope" }, chars))
  assert.ok(validateLessonBody(null, chars))
  assert.ok(validateLessonBody("x", chars))
})

test("lesson claim: characterId", () => {
  assert.ok(validateLessonBody({ action: "claim", characterId: "zzz" }, chars))
  assert.ok(validateLessonBody({ action: "claim" }, chars))
  assert.equal(validateLessonBody({ action: "claim", characterId: "a" }, chars), null)
})

test("config: neznámá akce a neplatné body", () => {
  assert.ok(validateConfigBody({ action: "nope" }, ids))
  assert.ok(validateConfigBody(null, ids))
})

test("config setTeamUnit", () => {
  assert.ok(validateConfigBody({ action: "setTeamUnit", teamId: "x", unitId: "u1" }, ids))
  assert.ok(validateConfigBody({ action: "setTeamUnit", teamId: "t1", unitId: "x" }, ids))
  assert.equal(validateConfigBody({ action: "setTeamUnit", teamId: "t1", unitId: "u1" }, ids), null)
})

test("config setCircleMembers", () => {
  const ok = { action: "setCircleMembers", circleId: "c1", memberIds: ["a"] }
  assert.equal(validateConfigBody(ok, ids), null)
  assert.equal(validateConfigBody({ ...ok, memberIds: [] }, ids), null)
  assert.ok(validateConfigBody({ ...ok, circleId: "x" }, ids))
  for (const m of ["a", {}, undefined, [1], ["zzz"]]) {
    assert.ok(validateConfigBody({ ...ok, memberIds: m }, ids))
  }
})

test("config setSpecialization", () => {
  const ok = { action: "setSpecialization", characterId: "a", specialization: null }
  assert.equal(validateConfigBody(ok, ids), null)
  assert.equal(validateConfigBody({ ...ok, specialization: "x" }, ids), null)
  assert.ok(validateConfigBody({ ...ok, characterId: "zzz" }, ids))
  assert.ok(validateConfigBody({ ...ok, specialization: 5 }, ids))
})
