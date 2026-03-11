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

type SimulationPhase = "pre" | "post"

type MetricSet = {
  requests_per_sec: number
  latency_p95: number
  error_rate: number
  cpu_usage: number
  memory_usage: number
}

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function getBaselineMetrics(): MetricSet {
  return {
    requests_per_sec: 12.3,
    latency_p95: 220,
    error_rate: 0.006,
    cpu_usage: 0.32,
    memory_usage: 0.45,
  }
}

function getImprovedMetrics(): MetricSet {
  return {
    requests_per_sec: 12.6,
    latency_p95: 205,
    error_rate: 0.002,
    cpu_usage: 0.29,
    memory_usage: 0.42,
  }
}

function getDegradedMetrics(): MetricSet {
  return {
    requests_per_sec: 10.2,
    latency_p95: 340,
    error_rate: 0.03,
    cpu_usage: 0.58,
    memory_usage: 0.66,
  }
}

function getWarningMetrics(): MetricSet {
  return {
    requests_per_sec: 12.1,
    latency_p95: 320,
    error_rate: 0.004,
    cpu_usage: 0.34,
    memory_usage: 0.48,
  }
}

function applyCurve(
  base: MetricSet,
  callCount: number,
  phase: SimulationPhase,
  now: number,
  mode: string,
): MetricSet {
  const minuteBucket = Math.floor(now / 60_000)
  const x = callCount + (minuteBucket % 997) / 3
  const waveSlow = Math.sin(x * 0.9)
  const waveMid = Math.sin(x * 0.37 + 1.4)
  const waveFast = Math.cos(x * 1.7 + 0.8)

  const phaseAmp = phase === "post" ? 1 : 0.8
  const modeAmp =
    mode === "stable"
      ? 0.55
      : mode === "oscillating"
        ? 1.2
        : mode === "ok"
          ? 0.85
          : 1
  const amp = phaseAmp * modeAmp

  const postIndex = Math.max(0, callCount - SIMULATION_SWITCH_AFTER_CALLS)
  const trendStrength = Math.min(postIndex, 8) / 8
  let postTrend = 0
  if (phase === "post") {
    if (mode === "improving" || mode === "ok") postTrend = trendStrength
    if (mode === "degrading") postTrend = -trendStrength
    if (mode === "warning") postTrend = -0.3 * trendStrength
    if (mode === "oscillating") postTrend = (postIndex % 2 === 0 ? 0.4 : -0.4) * trendStrength
  }
  

  const requestsPerSec =
    base.requests_per_sec + amp * (0.34 * waveSlow + 0.16 * waveMid) + postTrend * 0.35
  const latencyP95 = base.latency_p95 + amp * (11 * waveSlow + 5 * waveFast) - postTrend * 14
  const errorRate = base.error_rate + amp * (0.00065 * waveMid + 0.00025 * waveFast) - postTrend * 0.0013
  const cpuUsage = base.cpu_usage + amp * (0.017 * waveSlow + 0.009 * waveMid) - postTrend * 0.02
  const memoryUsage = base.memory_usage + amp * (0.018 * waveMid + 0.008 * waveFast) - postTrend * 0.018

  return {
    requests_per_sec: round(Math.max(0.05, requestsPerSec), 3),
    latency_p95: round(Math.max(10, latencyP95), 2),
    error_rate: round(clamp(errorRate, 0.0001, 0.95), 5),
    cpu_usage: round(clamp(cpuUsage, 0.05, 0.95), 4),
    memory_usage: round(clamp(memoryUsage, 0.05, 0.95), 4),
  }
}

function pickSimulatedMetrics(callCount: number, now: number) {
  const isPost = callCount > SIMULATION_SWITCH_AFTER_CALLS
  const phase: SimulationPhase = isPost ? "post" : "pre"
  let profile = SIMULATION_MODE
  let base: MetricSet

  switch (SIMULATION_MODE) {
    case "ok":
      base = isPost ? getImprovedMetrics() : getBaselineMetrics()
      break
    case "warning":
      base = isPost ? getWarningMetrics() : getBaselineMetrics()
      break
    case "stable":
      base = getBaselineMetrics()
      break
    case "degrading":
      base = isPost ? getDegradedMetrics() : getBaselineMetrics()
      break
    case "oscillating":
      if (!isPost) {
        base = getBaselineMetrics()
        profile = "baseline"
      } else if (callCount % 2 === 0) {
        base = getDegradedMetrics()
        profile = "degraded"
      } else {
        base = getImprovedMetrics()
        profile = "improved"
      }
      break
    case "improving":
    default:
      base = isPost ? getImprovedMetrics() : getBaselineMetrics()
      break
  }

  return {
    phase,
    profile,
    metrics: applyCurve(base, callCount, phase, now, SIMULATION_MODE),
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

  const now = Date.now()
  const callCount = nextSimulationCall(resolveSimulationSessionKey(request), now)
  const simulationResult = pickSimulatedMetrics(callCount, now)
  const metrics = simulationResult.metrics

  return NextResponse.json({
    metrics,
    ...metrics,
    simulation: {
      mode: SIMULATION_MODE,
      profile: simulationResult.profile,
      phase: simulationResult.phase,
      call_count: callCount,
      switch_after_calls: SIMULATION_SWITCH_AFTER_CALLS,
    },
  })
}
