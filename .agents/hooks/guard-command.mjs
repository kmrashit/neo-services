#!/usr/bin/env node
import fs from 'node:fs';

/**
 * Antigravity PreToolUse hook to validate and guard command executions.
 * Contract:
 * - Reads JSON payload from stdin: { toolCall: { name, args: { CommandLine } }, cwd, ... }
 * - Outputs JSON to stdout: { decision: "allow" | "deny" | "ask", reason?: string }
 */
async function main() {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input.trim()) {
    console.log(JSON.stringify({ decision: 'allow' }));
    return;
  }

  const payload = JSON.parse(input);
  const commandLine = payload.toolCall?.args?.CommandLine || '';

  // Patterns for highly destructive commands
  const dangerousPatterns = [
    /rm\s+-rf\s+[\/~]/i,
    /drop\s+database/i,
    /git\s+reset\s+--hard/i,
    /mkfs/i,
    /:>{1,2}\s*\/dev\/sda/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(commandLine)) {
      console.log(
        JSON.stringify({
          decision: 'deny',
          reason: `Command blocked by guard-command: matches dangerous pattern (${pattern}).`
        })
      );
      return;
    }
  }

  // Guard git commit: always require asking the user before committing
  if (/git\s+commit/i.test(commandLine)) {
    console.log(
      JSON.stringify({
        decision: 'ask',
        reason: 'Rule enforcement: Always ask user confirmation before running git commit.'
      })
    );
    return;
  }

  // Default: allow execution
  console.log(JSON.stringify({ decision: 'allow' }));
}

main().catch((err) => {
  // Fallback gracefully on error so agent isn't hard-blocked unintentionally
  console.error(err);
  console.log(JSON.stringify({ decision: 'allow' }));
});
