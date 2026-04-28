import { EventEmitter } from "events"
import type { AlarmState } from "./types"

export type GameEvent =
  | ({ type: "alarm" } & ({ active: true; alarmType: AlarmState["type"]; message: string; color: string } | { active: false }))
  | { type: "state-changed" }
  | { type: "config-changed" }
  | { type: "run-changed" }

const emitter = new EventEmitter()
emitter.setMaxListeners(200)

export function emitGameEvent(event: GameEvent): void {
  emitter.emit("game-event", event)
}

export function onGameEvent(cb: (event: GameEvent) => void): () => void {
  emitter.on("game-event", cb)
  return () => emitter.off("game-event", cb)
}
