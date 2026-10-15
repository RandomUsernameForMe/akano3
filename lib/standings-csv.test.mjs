import test from "node:test"
import assert from "node:assert/strict"
import { buildStandingsCsv } from "./standings-csv.ts"
import { unitPoints, circlePoints } from "./score-aggregation.ts"

const teams = [
  { id: "t1", name: "Alfa", unitId: "u1", points: 5 },
  { id: "t2", name: "Beta", unitId: "u2", points: 30 },
]
const characters = [
  { name: "Novák, Jan", role: "student", teamId: "t1", circleIds: ["c1"], points: 10 },
  { name: 'Eva "Ev" Malá', role: "student", teamId: "t2", circleIds: ["c1"], points: 30 },
  { name: "Petr", role: "student", teamId: "t2", circleIds: ["c2"], points: 10 },
  { name: "GM", role: "gm", circleIds: [], points: 999 },
]
const units = [{ id: "u1", name: "Jedna" }, { id: "u2", name: "Dva" }]
const circles = [{ id: "c1", name: "K1" }, { id: "c2", name: "K2" }]

const csv = buildStandingsCsv({ characters, teams, units, circles })
const sections = Object.fromEntries(csv.trim().split("\n\n").map(s => {
  const [title, header, ...rows] = s.split("\n")
  return [title, { header, rows }]
}))

test("studenti: sestupně, shodné body sdílí pořadí, escapování", () => {
  assert.equal(sections.Studenti.header, "Pořadí,Jméno,Tým,Body")
  assert.deepEqual(sections.Studenti.rows, [
    '1,"Eva ""Ev"" Malá",Beta,30',
    '2,"Novák, Jan",Alfa,10',
    "2,Petr,Beta,10",
  ])
})

test("týmy seřazené sestupně", () => {
  assert.deepEqual(sections["Týmy"].rows, ["1,Beta,30", "2,Alfa,5"])
})

test("jednotky a kruhy odpovídají unitPoints/circlePoints", () => {
  const u = units.map(x => [x.name, unitPoints(x.id, teams, characters)]).sort((a, b) => b[1] - a[1])
  assert.deepEqual(sections.Jednotky.rows, u.map(([n, p], i) => `${i + 1},${n},${p}`))
  const c = circles.map(x => [x.name, circlePoints(x.id, characters)]).sort((a, b) => b[1] - a[1])
  assert.deepEqual(sections.Kruhy.rows, c.map(([n, p], i) => `${i + 1},${n},${p}`))
})
