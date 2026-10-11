import test from "node:test"
import assert from "node:assert/strict"
import {
  resolveTargetCharacters,
  teamsOfChars,
  resolvedCharsOf,
  teamDeltaOf,
  buildReversal,
  isReversed,
  isReversal,
} from "./point-resolution.ts"

test("resolveTargetCharacters: student", () => {
  assert.deepEqual(resolveTargetCharacters("student", "S001"), ["S001"])
  assert.deepEqual(resolveTargetCharacters("student", "TCH1"), [])
})

test("resolveTargetCharacters: team", () => {
  assert.deepEqual(resolveTargetCharacters("team", "T01"), ["S001", "S002", "S003"])
})

test("resolveTargetCharacters: unit", () => {
  assert.deepEqual(
    resolveTargetCharacters("unit", "U1"),
    ["S001", "S002", "S003", "S004", "S005", "S006"]
  )
})

test("resolveTargetCharacters: circle includes the Růže", () => {
  assert.deepEqual(
    resolveTargetCharacters("circle", "C1"),
    ["S003", "S009", "S015", "S021", "S026"]
  )
})

test("resolveTargetCharacters: unknown ids give []", () => {
  for (const [type, id] of [["student", "X"], ["team", "T99"], ["unit", "U9"], ["circle", "C9"]]) {
    assert.deepEqual(resolveTargetCharacters(type, id), [])
  }
})

test("teamsOfChars deduplicates and drops non-members", () => {
  assert.deepEqual(teamsOfChars(["S001", "S002", "S004", "TCH1"]), ["T01", "T02"])
})

test("resolvedCharsOf returns resolvedCharacterIds when present", () => {
  assert.deepEqual(
    resolvedCharsOf({ resolvedCharacterIds: ["S004"], resolvedTeamIds: ["T01"] }),
    ["S004"]
  )
})

test("resolvedCharsOf falls back to resolvedTeamIds (legacy)", () => {
  const expected = ["S001", "S002", "S003"]
  assert.deepEqual(resolvedCharsOf({ resolvedTeamIds: ["T01"] }), expected)
  assert.deepEqual(resolvedCharsOf({ resolvedCharacterIds: [], resolvedTeamIds: ["T01"] }), expected)
})

test("teamDeltaOf: per-student mode multiplies by credited members", () => {
  assert.deepEqual(
    teamDeltaOf({ resolvedCharacterIds: ["S001", "S002", "S004"], resolvedTeamIds: [], amount: 5 }),
    { T01: 10, T02: 5 }
  )
})

test("teamDeltaOf: legacy mode gives amount once per team", () => {
  assert.deepEqual(
    teamDeltaOf({ resolvedTeamIds: ["T01", "T02"], amount: 15 }),
    { T01: 15, T02: 15 }
  )
  assert.deepEqual(
    teamDeltaOf({ resolvedCharacterIds: [], resolvedTeamIds: ["T01"], amount: 3 }),
    { T01: 3 }
  )
})

test("buildReversal: negated amount, same target, correction, note with id", () => {
  const entry = { id: "PE1", targetType: "team", targetId: "T01", amount: 10 }
  const r = buildReversal(entry)
  assert.equal(r.amount, -10)
  assert.equal(r.targetType, "team")
  assert.equal(r.targetId, "T01")
  assert.equal(r.actionType, "correction")
  assert.equal(r.note, "Storno: PE1")
  assert.equal(entry.amount, 10)
})

test("buildReversal: includes original note", () => {
  const r = buildReversal({ id: "PE2", targetType: "student", targetId: "S001", amount: -3, note: "Pozdě" })
  assert.equal(r.amount, 3)
  assert.equal(r.note, "Storno: PE2 (Pozdě)")
})

test("isReversed detects an existing reversal by note", () => {
  const entry = { id: "PE1", targetType: "team", targetId: "T01", amount: 10 }
  assert.equal(isReversed(entry, [entry]), false)
  const rev = buildReversal(entry)
  assert.equal(isReversed(entry, [entry, rev]), true)
  assert.equal(isReversed({ id: "PE10" }, [rev]), false)
  assert.equal(isReversal(rev), true)
  assert.equal(isReversal(entry), false)
})
