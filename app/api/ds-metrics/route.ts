import { NextResponse } from "next/server"
import crypto from "crypto"

export const runtime = "nodejs"

const HMAC_ENABLED = process.env.SEQPULSE_HMAC_ENABLED === "true"
const HMAC_SECRET = process.env.SEQPULSE_HMAC_SECRET || ""
const MAX_SKEW_PAST = Number(process.env.SEQPULSE_HMAC_MAX_SKEW_PAST || 300)
const MAX_SKEW_FUTURE = Number(process.env.SEQPULSE_HMAC_MAX_SKEW_FUTURE || 30)
const NONCE_TTL_MS = (MAX_SKEW_PAST + MAX_SKEW_FUTURE) * 1000

const SIMULATION_MODE = (process.env.SEQPULSE_SIMULATION_MODE || "improving").toLowerCase()
const SIMULATION_SWITCH_AFTER_CALLS = Math.max(
  1,
  Number(process.env.SEQPULSE_SIMULATION_SWITCH_AFTER_CALLS || 1),
)
const SIMULATION_SESSION_TTL_MS = Math.max(
  60_000,
  Number(process.env.SEQPULSE_SIMULATION_SESSION_TTL_MS || 15 * 60 * 1000),
)

const nonceCache = new Map<string, number>()
const simulationSessions = new Map<string, { calls: number; lastSeen: number }>()

function cleanupNonceCache(now: number) {
  for (const [nonce, ts] of nonceCache.entries()) {
    if (now - ts > NONCE_TTL_MS) nonceCache.delete(nonce)
  }
}

function isNonceReused(nonce: string, now: number) {
  cleanupNonceCache(now)
  if (nonceCache.has(nonce)) return true
  nonceCache.set(nonce, now)
  return false
}

function cleanupSimulationSessions(now: number) {
  for (const [sessionKey, state] of simulationSessions.entries()) {
    if (now - state.lastSeen > SIMULATION_SESSION_TTL_MS) simulationSessions.delete(sessionKey)
  }
}

function nextSimulationCall(sessionKey: string, now: number) {
  cleanupSimulationSessions(now)
  const state = simulationSessions.get(sessionKey)
  if (!state) {
    simulationSessions.set(sessionKey, { calls: 1, lastSeen: now })
    return 1
  }

  state.calls += 1
  state.lastSeen = now
  simulationSessions.set(sessionKey, state)
  return state.calls
}

function resolveSimulationSessionKey(request: Request) {
  const projectId = request.headers.get("X-SeqPulse-Project-Id")
  if (projectId) return `seqpulse:${projectId}`
  return "default"
}

function canonicalizePath(path: string) {
  if (!path) return "/"
  if (!path.startsWith("/")) path = `/${path}`
  if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1)
  return path
}

function validateTimestamp(ts: string, now: number) {
  const sent = Date.parse(ts)
  if (Number.isNaN(sent)) throw new Error("Invalid timestamp")
  const deltaSec = (now - sent) / 1000
  if (deltaSec > MAX_SKEW_PAST) throw new Error("Timestamp too old")
  if (deltaSec < -MAX_SKEW_FUTURE) throw new Error("Timestamp too far in the future")
}

function buildSignature(secret: string, ts: string, method: string, path: string, nonce: string) {
  const payload = `${ts}|${method}|${path}|${nonce}`
  const digest = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return `sha256=${digest}`
}

function getBaselineMetrics() {
  return {
    requests_per_sec: 12.3,
    latency_p95: 220,
    error_rate: 0.006,
    cpu_usage: 0.32,
    memory_usage: 0.45,
  }
}

function getImprovedMetrics() {
  return {
    requests_per_sec: 12.6,
    latency_p95: 205,
    error_rate: 0.002,
    cpu_usage: 0.29,
    memory_usage: 0.42,
  }
}

function getDegradedMetrics() {
  return {
    requests_per_sec: 10.2,
    latency_p95: 340,
    error_rate: 0.03,
    cpu_usage: 0.58,
    memory_usage: 0.66,
  }
}

function getWarningMetrics() {
  return {
    requests_per_sec: 12.1,
    latency_p95: 320,
    error_rate: 0.004,
    cpu_usage: 0.34,
    memory_usage: 0.48,
  }
}

function pickSimulatedMetrics(callCount: number) {
  const switched = callCount > SIMULATION_SWITCH_AFTER_CALLS

  switch (SIMULATION_MODE) {
    case "ok":
      return getImprovedMetrics()
    case "warning":
      return getWarningMetrics()
    case "stable":
      return getBaselineMetrics()
    case "degrading":
      return switched ? getDegradedMetrics() : getBaselineMetrics()
    case "oscillating":
      if (!switched) return getBaselineMetrics()
      return callCount % 2 === 0 ? getDegradedMetrics() : getImprovedMetrics()
    case "improving":
    default:
      return switched ? getImprovedMetrics() : getBaselineMetrics()
  }
}

export async function GET(request: Request) {
  if (HMAC_ENABLED) {
    const headers = request.headers
    const ts = headers.get("X-SeqPulse-Timestamp") || ""
    const nonce = headers.get("X-SeqPulse-Nonce") || ""
    const sig = headers.get("X-SeqPulse-Signature") || ""
    const ver = headers.get("X-SeqPulse-Signature-Version") || ""
    const method = (headers.get("X-SeqPulse-Method") || request.method || "GET").toUpperCase()
    const canonicalPath = canonicalizePath(
      headers.get("X-SeqPulse-Canonical-Path") || new URL(request.url).pathname,
    )

    if (!ts || !nonce || !sig || ver !== "v2") {
      return NextResponse.json({ error: "Missing or invalid HMAC headers" }, { status: 401 })
    }

    try {
      validateTimestamp(ts, Date.now())
    } catch {
      return NextResponse.json({ error: "Invalid timestamp" }, { status: 401 })
    }

    if (isNonceReused(nonce, Date.now())) {
      return NextResponse.json({ error: "Nonce reuse" }, { status: 401 })
    }

    const expected = buildSignature(HMAC_SECRET, ts, method, canonicalPath, nonce)
    const expBuf = Buffer.from(expected)
    const sigBuf = Buffer.from(sig)
    if (expBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expBuf, sigBuf)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  }

  const callCount = nextSimulationCall(resolveSimulationSessionKey(request), Date.now())
  const metrics = pickSimulatedMetrics(callCount)

  return NextResponse.json({
    metrics,
    ...metrics,
    simulation: {
      mode: SIMULATION_MODE,
      call_count: callCount,
      switch_after_calls: SIMULATION_SWITCH_AFTER_CALLS,
    },
  })
}
