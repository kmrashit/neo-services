#!/usr/bin/env bash
set -euo pipefail

HISTORY_DIR="e2e/history"
MAX_SLOTS=35

mkdir -p "${HISTORY_DIR}"

# Count total entries in history
count=$(find "${HISTORY_DIR}" -mindepth 1 -maxdepth 1 | wc -l)

if [ "${count}" -gt "${MAX_SLOTS}" ]; then
  # Remove oldest entries exceeding the limit
  find "${HISTORY_DIR}" -mindepth 1 -maxdepth 1 -printf '%T+ %p\n' | \
    sort | \
    head -n "$((count - MAX_SLOTS))" | \
    cut -d' ' -f2- | \
    xargs rm -rf
fi

echo "Playwright history rotation verified: ${count} entries (limit: ${MAX_SLOTS})."
