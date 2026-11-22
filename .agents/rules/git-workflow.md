---
trigger: always_on
---

# Git Commit & Version Control Rules

1. **ALWAYS ASK BEFORE COMMITTING**:
   - The agent MUST NEVER execute `git commit` or create git commits autonomously or automatically without explicit prior user approval and confirmation.
   - When changes are ready to commit:
     1. Run necessary tests, verification checks, and linters (`cd fortlio-be && bun run lint` and `cd fortlio-ui && bun run lint`).
     2. Inspect `git status` and changed files.
     3. Present the proposed commit message, summary of changes, and list of modified/added files to the USER.
     4. Explicitly ask the user for confirmation to proceed with the commit and wait for their approval.
2. **Never Push Without Instruction**:
   - The agent MUST NEVER run `git push` unless specifically and explicitly requested by the user.
