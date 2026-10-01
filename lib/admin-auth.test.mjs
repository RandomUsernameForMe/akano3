import { test, afterEach } from "node:test"
import assert from "node:assert/strict"
import { adminGuard } from "./admin-auth.ts"

const original = process.env.ADMIN_TOKEN

afterEach(() => {
  if (original === undefined) delete process.env.ADMIN_TOKEN
  else process.env.ADMIN_TOKEN = original
})

const req = (token) =>
  new Request("http://x/api/admin", { headers: token === undefined ? {} : { "x-admin-token": token } })

test("bez ADMIN_TOKEN vrací 503 i s hlavičkou", () => {
  delete process.env.ADMIN_TOKEN
  assert.equal(adminGuard(req("secret")).status, 503)
})

test("prázdný ADMIN_TOKEN vrací 503", () => {
  process.env.ADMIN_TOKEN = ""
  assert.equal(adminGuard(req("")).status, 503)
})

test("chybějící hlavička vrací 401", () => {
  process.env.ADMIN_TOKEN = "secret"
  assert.equal(adminGuard(req()).status, 401)
})

test("špatný token stejné délky vrací 401", () => {
  process.env.ADMIN_TOKEN = "secret"
  assert.equal(adminGuard(req("secreX")).status, 401)
})

test("špatný token jiné délky vrací 401", () => {
  process.env.ADMIN_TOKEN = "secret"
  assert.equal(adminGuard(req("sec")).status, 401)
  assert.equal(adminGuard(req("secret-longer")).status, 401)
})

test("správný token vrací null", () => {
  process.env.ADMIN_TOKEN = "secret"
  assert.equal(adminGuard(req("secret")), null)
})
