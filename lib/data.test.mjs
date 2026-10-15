import test from "node:test"
import assert from "node:assert/strict"
import { TEAMS, UNITS, CIRCLES, CHARACTERS, TEAM_ICONS } from "./data.ts"

const byId = (list) => new Map(list.map((x) => [x.id, x]))
const chars = byId(CHARACTERS)
const teams = byId(TEAMS)
const units = byId(UNITS)
const isStudent = (c) => c?.role === "student" || c?.role === "ruze"

test("id a code postav, id týmů, jednotek a kroužků jsou unikátní", () => {
  for (const list of [CHARACTERS, TEAMS, UNITS, CIRCLES]) {
    assert.equal(new Set(list.map((x) => x.id)).size, list.length)
  }
  assert.equal(new Set(CHARACTERS.map((c) => c.code)).size, CHARACTERS.length)
})

test("memberIds týmu odkazují na existující postavy se shodným teamId", () => {
  for (const t of TEAMS) {
    for (const id of t.memberIds) {
      assert.ok(chars.has(id), `${t.id}: postava ${id} neexistuje`)
      assert.equal(chars.get(id).teamId, t.id, `${id} má jiný teamId než ${t.id}`)
    }
  }
})

test("každá postava s teamId je v memberIds svého týmu a sdílí jeho unitId", () => {
  for (const c of CHARACTERS.filter((c) => c.teamId)) {
    const t = teams.get(c.teamId)
    assert.ok(t, `${c.id}: tým ${c.teamId} neexistuje`)
    assert.ok(t.memberIds.includes(c.id), `${c.id} chybí v ${t.id}.memberIds`)
    assert.equal(c.unitId, t.unitId, `${c.id}: unitId se liší od týmu`)
  }
})

test("unitId týmu odpovídá UNITS[].teamIds oběma směry", () => {
  for (const t of TEAMS) {
    assert.ok(units.has(t.unitId), `${t.id}: jednotka ${t.unitId} neexistuje`)
    assert.ok(units.get(t.unitId).teamIds.includes(t.id), `${t.id} chybí v ${t.unitId}.teamIds`)
  }
  for (const u of UNITS) {
    for (const id of u.teamIds) {
      assert.ok(teams.has(id), `${u.id}: tým ${id} neexistuje`)
      assert.equal(teams.get(id).unitId, u.id)
    }
  }
})

test("členové kroužků existují, jsou studenti a circleIds souhlasí oběma směry", () => {
  for (const circle of CIRCLES) {
    for (const id of circle.memberIds) {
      assert.ok(isStudent(chars.get(id)), `${circle.id}: ${id} není student`)
      assert.ok(chars.get(id).circleIds.includes(circle.id), `${id} nemá ${circle.id} v circleIds`)
    }
  }
  for (const c of CHARACTERS) {
    for (const cid of c.circleIds) {
      const circle = CIRCLES.find((x) => x.id === cid)
      assert.ok(circle, `${c.id}: kroužek ${cid} neexistuje`)
      assert.ok(circle.memberIds.includes(c.id), `${c.id} chybí v ${cid}.memberIds`)
    }
  }
})

test("každý tým má ikonu v TEAM_ICONS a nejsou tam nadbytečné klíče", () => {
  for (const t of TEAMS) assert.ok(TEAM_ICONS[t.id], `${t.id} nemá ikonu`)
  assert.deepEqual(Object.keys(TEAM_ICONS).sort(), TEAMS.map((t) => t.id).sort())
})
