import { NextResponse } from "next/server"
import crypto from "crypto"

export const runtime = "nodejs"

const HMAC_ENABLED = process.env.SEQPULSE_HMAC_ENABLED === "true"
const HMAC_SECRET = process.env.SEQPULSE_HMAC_SECRET || ""
const MAX_SKEW_PAST = Number(process.env.SEQPULSE_HMAC_MAX_SKEW_PAST || 300)
const MAX_SKEW_FUTURE = Number(process.env.SEQPULSE_HMAC_MAX_SKEW_FUTURE || 30)
const NONCE_TTL_MS = (MAX_SKEW_PAST + MAX_SKEW_FUTURE) * 1000

const nonceCache = new Map<string, number>()

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

export async function GET(request: Request) {
  if (HMAC_ENABLED) {
    const headers = request.headers
    const ts = headers.get("X-SeqPulse-Timestamp") || ""
    const nonce = headers.get("X-SeqPulse-Nonce") || ""
    const sig = headers.get("X-SeqPulse-Signature") || ""
    const ver = headers.get("X-SeqPulse-Signature-Version") || ""
    const method = (headers.get("X-SeqPulse-Method") || "GET").toUpperCase()
    const canonicalPath = canonicalizePath(headers.get("X-SeqPulse-Canonical-Path") || "/ds-metrics")

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

  const url = new URL(request.url)
  const mode = url.searchParams.get("mode")
  const scenario = url.searchParams.get("scenario")
  const isPost = mode === "post"

  const metrics = isPost
    ? scenario === "warning"
      ? {
          // Keep post-deploy profile healthy to produce an OK verdict.
          requests_per_sec: 12.1,
          latency_p95: 230,
          error_rate: 0.004,
          cpu_usage: 0.36,
          memory_usage: 0.47,
        }
      : {
          // Default POST profile (healthy)
          requests_per_sec: 12.0,
          latency_p95: 225,
          error_rate: 0.0045,
          cpu_usage: 0.35,
          memory_usage: 0.46,
        }
    : {
        // Baseline PRE metrics
        requests_per_sec: 12.3,
        latency_p95: 220,
        error_rate: 0.01,
        cpu_usage: 0.32,
        memory_usage: 0.45,
      }

  return NextResponse.json({
    metrics,
    ...metrics,
  })
}
