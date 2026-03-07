#!/usr/bin/env bash
set -euo pipefail

warn() {
  echo "::warning::$1"
}

if [[ -z "${DEPLOY_ID:-}" ]]; then
  echo "No DEPLOY_ID found, skipping finish"
  exit 0
fi

if [[ -z "${SEQPULSE_BASE_URL:-}" || -z "${SEQPULSE_API_KEY:-}" || -z "${SEQPULSE_METRICS_ENDPOINT:-}" ]]; then
  warn "SeqPulse finish skipped (missing SEQPULSE_BASE_URL / SEQPULSE_API_KEY / SEQPULSE_METRICS_ENDPOINT)."
  exit 0
fi

RESULT="failed"
if [[ "${SEQPULSE_PIPELINE_RESULT:-${JOB_STATUS:-}}" == "success" ]]; then
  RESULT="success"
fi

PAYLOAD="$(jq -cn \
  --arg deployment_id "$DEPLOY_ID" \
  --arg result "$RESULT" \
  --arg metrics_endpoint "$SEQPULSE_METRICS_ENDPOINT" \
  '{deployment_id:$deployment_id,result:$result,metrics_endpoint:$metrics_endpoint}')"

RESPONSE="$(curl -sS \
  --retry 0 \
  --connect-timeout "${SEQPULSE_HTTP_CONNECT_TIMEOUT_SECONDS:-1}" \
  --max-time "${SEQPULSE_HTTP_MAX_TIME_SECONDS:-4}" \
  -H "X-API-Key: $SEQPULSE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w $'\n%{http_code}' \
  "$SEQPULSE_BASE_URL/deployments/finish" || true)"

HTTP_STATUS="${RESPONSE##*$'\n'}"
BODY="${RESPONSE%$'\n'*}"

if [[ -z "$HTTP_STATUS" || "$HTTP_STATUS" == "000" ]]; then
  warn "SeqPulse finish unreachable. Deployment stays successful."
  exit 0
fi

if [[ "$HTTP_STATUS" -ge 400 ]]; then
  warn "SeqPulse finish returned HTTP $HTTP_STATUS. Deployment stays successful."
  echo "SeqPulse response: ${BODY:0:700}"
  exit 0
fi

echo "SeqPulse finish accepted."
