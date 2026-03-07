#!/usr/bin/env bash
set -euo pipefail

warn() {
  echo "::warning::$1"
}

if [[ -z "${SEQPULSE_BASE_URL:-}" || -z "${SEQPULSE_API_KEY:-}" || -z "${SEQPULSE_METRICS_ENDPOINT:-}" ]]; then
  warn "SeqPulse disabled for this run (missing SEQPULSE_BASE_URL / SEQPULSE_API_KEY / SEQPULSE_METRICS_ENDPOINT)."
  exit 0
fi

PAYLOAD="$(jq -cn \
  --arg env "prod" \
  --arg metrics_endpoint "$SEQPULSE_METRICS_ENDPOINT" \
  --arg idempotency_key "gha-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}" \
  --arg branch "${GITHUB_REF_NAME:-unknown}" \
  '{env:$env,metrics_endpoint:$metrics_endpoint,idempotency_key:$idempotency_key,branch:$branch}')"

RESPONSE="$(curl -sS \
  --retry 0 \
  --connect-timeout "${SEQPULSE_HTTP_CONNECT_TIMEOUT_SECONDS:-1}" \
  --max-time "${SEQPULSE_HTTP_MAX_TIME_SECONDS:-4}" \
  -H "X-API-Key: $SEQPULSE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w $'\n%{http_code}' \
  "$SEQPULSE_BASE_URL/deployments/trigger" || true)"

HTTP_STATUS="${RESPONSE##*$'\n'}"
BODY="${RESPONSE%$'\n'*}"

if [[ -z "$HTTP_STATUS" || "$HTTP_STATUS" == "000" ]]; then
  warn "SeqPulse trigger unreachable. Continuing deployment without SeqPulse."
  exit 0
fi

if [[ "$HTTP_STATUS" -ge 400 ]]; then
  warn "SeqPulse trigger returned HTTP $HTTP_STATUS. Continuing deployment without SeqPulse."
  echo "SeqPulse response: ${BODY:0:700}"
  exit 0
fi

DEPLOY_ID="$(jq -r '.deployment_id // empty' <<<"$BODY")"
if [[ -z "$DEPLOY_ID" ]]; then
  warn "SeqPulse trigger did not return deployment_id. Continuing deployment without SeqPulse."
  echo "SeqPulse response: ${BODY:0:700}"
  exit 0
fi

echo "DEPLOY_ID=$DEPLOY_ID" >> "$GITHUB_ENV"
echo "SeqPulse deployment_id: $DEPLOY_ID"
