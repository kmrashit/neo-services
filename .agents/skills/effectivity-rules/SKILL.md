---
name: effectivity-rules
description: Use when calculating or validating time-based effectivity ranges, lot effectivity, or configuration validity.
---

# Effectivity Rules Engine

Procedures for evaluating time and unit effectivity conditions.

## Evaluation Steps
1. Parse the effectivity start and end timestamps or serial thresholds.
2. Evaluate active status based on the target execution date.
3. Fall back to base version if no active override rule matches.
