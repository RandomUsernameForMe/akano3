import { type NextRequest } from "next/server"
import { onGameEvent } from "@/lib/event-bus"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()
  let unsubscribe: (() => void) | undefined
  let heartbeatId: ReturnType<typeof setInterval> | undefined

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(":ok\n\n"))

      heartbeatId = setInterval(() => {
        try { controller.enqueue(encoder.encode(":heartbeat\n\n")) } catch { /* stream closed */ }
      }, 25000)

      unsubscribe = onGameEvent(event => {
        const line = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`
        try { controller.enqueue(encoder.encode(line)) } catch { /* stream closed */ }
      })

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeatId)
        unsubscribe?.()
        try { controller.close() } catch { /* already closed */ }
      })
    },
    cancel() {
      clearInterval(heartbeatId)
      unsubscribe?.()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
