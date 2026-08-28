#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
	echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: .env file not found at $ENV_FILE" >&2
	exit 1
fi

# Export variables from .env for this script run.
set -a
source "$ENV_FILE"
set +a

if [[ -z "${VITE_SUPABASE_URL:-}" || -z "${VITE_SUPABASE_ANON_KEY:-}" ]]; then
	echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in .env" >&2
	exit 1
fi

PING_URL="${VITE_SUPABASE_URL%/}/rest/v1/"

HTTP_CODE=$(curl -sS -o /dev/null -w "%{http_code}" \
	--max-time 20 \
	-H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
	-H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
	"$PING_URL")

if [[ "$HTTP_CODE" =~ ^2|3|4 ]]; then
	echo "[$(date '+%Y-%m-%d %H:%M:%S')] Supabase ping sent successfully. HTTP $HTTP_CODE"
	exit 0
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Supabase ping failed. HTTP $HTTP_CODE" >&2
exit 1
