import crypto from "crypto"

const BASE_URL = "http://localhost:3000/api/ds-metrics"
const SECRET = "TON_HMAC_SECRET_LOCAL"

const ts = new Date().toISOString().replace(/\.\d{3}Z$/, "Z")
const nonce = "replay-test-123"
const method = "GET"
const path = "/ds-metrics"

const payload = `${ts}|${method}|${path}|${nonce}`
const signature = "sha256=" + crypto.createHmac("sha256", SECRET).update(payload).digest("hex")

const headers = {
  "X-SeqPulse-Timestamp": ts,
  "X-SeqPulse-Nonce": nonce,
  "X-SeqPulse-Signature": signature,
  "X-SeqPulse-Signature-Version": "v2",
  "X-SeqPulse-Canonical-Path": path,
  "X-SeqPulse-Method": method
}

async function run() {
  const r1 = await fetch(BASE_URL, { headers })
  console.log("First:", r1.status, await r1.text())

  const r2 = await fetch(BASE_URL, { headers })
  console.log("Second:", r2.status, await r2.text())
}

run()
