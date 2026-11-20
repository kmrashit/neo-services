#!/usr/bin/env node
import fs from 'node:fs';

/**
 * Antigravity PostToolUse hook executed after edit_file or write_file.
 * Contract:
 * - Reads JSON payload from stdin: { toolCall, stepIdx, error, cwd, ... }
 * - Outputs empty JSON object `{}` to stdout.
 */
async function main() {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input.trim()) {
    console.log(JSON.stringify({}));
    return;
  }

  const payload = JSON.parse(input);
  const filePath = payload.toolCall?.args?.Path;

  // You can trigger auto-formatters, linters, or diagnostics here for changed files
  if (filePath && fs.existsSync(filePath)) {
    // e.g. run prettier or eslint if needed
  }

  console.log(JSON.stringify({}));
}

main().catch(() => {
  console.log(JSON.stringify({}));
});
