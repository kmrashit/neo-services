#!/usr/bin/env node
import fs from 'node:fs';

/**
 * Antigravity Stop hook executed before terminating an agent turn.
 * Contract:
 * - Reads JSON from stdin: { executionNum, terminationReason, continuationActive, ... }
 * - Outputs: { decision: "continue" | "stop", reason?: string }
 */
async function main() {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input.trim()) {
    console.log(JSON.stringify({ decision: 'stop' }));
    return;
  }

  const payload = JSON.parse(input);

  // If a continuation was already active this turn, avoid endless continuation loops
  if (payload.continuationActive) {
    console.log(JSON.stringify({ decision: 'stop' }));
    return;
  }

  // Default: allow turn to complete normally
  console.log(JSON.stringify({ decision: 'stop' }));
}

main().catch(() => {
  console.log(JSON.stringify({ decision: 'stop' }));
});
