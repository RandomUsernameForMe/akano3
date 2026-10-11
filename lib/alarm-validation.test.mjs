import test from "node:test"
import assert from "node:assert/strict"
import { parseAlarmBody, ALARM_MESSAGE_MAX } from "./alarm-validation.ts"

test("platný trigger", () => {
  assert.deepEqual(parseAlarmBody({ action: "trigger", type: "battle", message: "x" }),
    { ok: true, value: { action: "trigger", type: "battle", message: "x" } })
})

test("trigger bez message dá prázdný string", () => {
  const r = parseAlarmBody({ action: "trigger", type: "custom" })
  assert.equal(r.ok, true)
  assert.equal(r.value.message, "")
})

test("dismiss", () => {
  assert.deepEqual(parseAlarmBody({ action: "dismiss" }), { ok: true, value: { action: "dismiss" } })
})

test("neznámý typ", () => {
  assert.equal(parseAlarmBody({ action: "trigger", type: "foo" }).ok, false)
  assert.equal(parseAlarmBody({ action: "trigger", type: "toString" }).ok, false)
})

test("chybějící typ", () => {
  assert.equal(parseAlarmBody({ action: "trigger" }).ok, false)
})

test("message není string nebo je příliš dlouhá", () => {
  assert.equal(parseAlarmBody({ action: "trigger", type: "battle", message: 123 }).ok, false)
  assert.equal(parseAlarmBody({ action: "trigger", type: "battle", message: "a".repeat(ALARM_MESSAGE_MAX + 1) }).ok, false)
})

test("neznámá action", () => {
  assert.equal(parseAlarmBody({ action: "explode" }).ok, false)
  assert.equal(parseAlarmBody({}).ok, false)
  assert.equal(parseAlarmBody(null).ok, false)
})
