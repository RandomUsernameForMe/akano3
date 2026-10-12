import test from "node:test"
import assert from "node:assert/strict"
import { unitPoints, circlePoints } from "./score-aggregation.ts"

test("circlePoints: sums characters by circleIds, not static CIRCLES", () => {
  const chars = [
    { circleIds: ["X"], points: 10 },
    { circleIds: ["X", "Y"], points: 5 },
    { circleIds: ["Y"], points: 7 },
    { circleIds: [], points: 100 },
  ]
  assert.equal(circlePoints("X", chars), 15)
  assert.equal(circlePoints("Y", chars), 12)
})

test("circlePoints: unknown circle is 0", () => {
  assert.equal(circlePoints("nope", [{ circleIds: ["X"], points: 3 }]), 0)
})

test("unitPoints: sums characters of teams with given unitId", () => {
  const teams = [
    { id: "T1", unitId: "U9" },
    { id: "T2", unitId: "U9" },
    { id: "T3", unitId: "U8" },
  ]
  const chars = [
    { teamId: "T1", points: 4 },
    { teamId: "T2", points: 6 },
    { teamId: "T3", points: 50 },
    { teamId: undefined, points: 99 },
  ]
  assert.equal(unitPoints("U9", teams, chars), 10)
  assert.equal(unitPoints("U8", teams, chars), 50)
})

test("unitPoints: unknown unit is 0", () => {
  assert.equal(unitPoints("nope", [{ id: "T1", unitId: "U1" }], [{ teamId: "T1", points: 1 }]), 0)
})
