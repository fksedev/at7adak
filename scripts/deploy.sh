#!/usr/bin/env bash
#
# Run on the Hetzner server after git push (from repo root or anywhere):
#   ./scripts/deploy.sh
#
# Optional env:
#   DEPLOY_BRANCH=main   git branch to pull (default: main)
#   PM2_APP_NAME=at7adak  PM2 process name (default: at7adak)
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BRANCH="${DEPLOY_BRANCH:-main}"
PM2_NAME="${PM2_APP_NAME:-at7adak}"

echo "==> AT7ADAK deploy"
echo "    Directory: $ROOT"
echo "    Branch:    $BRANCH"

if [[ ! -f "$ROOT/.env" ]]; then
	echo "ERROR: Missing $ROOT/.env (copy from .env.example and set DATABASE_URL, ORIGIN)."
	exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
	echo "ERROR: pm2 not found. Install: npm install -g pm2"
	exit 1
fi

echo "==> git pull origin $BRANCH"
git fetch origin "$BRANCH"
git pull origin "$BRANCH"

# Keep uploaded APKs / meta across deploys
mkdir -p "$ROOT/data/downloads"

echo "==> npm install (skip postinstall migrate)"
npm install --ignore-scripts

echo "==> svelte-kit sync"
npx svelte-kit sync

echo "==> npm run build"
npm run build

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
	echo "==> pm2 restart $PM2_NAME"
	pm2 restart ecosystem.config.cjs --update-env
else
	echo "==> pm2 start (first deploy)"
	pm2 start ecosystem.config.cjs
	pm2 save
	echo "    Run 'pm2 startup' once if this server has not been configured for reboot."
fi

echo "==> Deploy finished"
echo "    APK admin: /dashboard/apk  (upload updates without code changes)"
pm2 status "$PM2_NAME"
