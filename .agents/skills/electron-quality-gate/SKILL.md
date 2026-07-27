---
name: electron-quality-gate
description: Verify and review Electron template changes. Use for test failures, regressions, dependency upgrades, refactors, cross-process changes, security-sensitive review, and final validation before a local commit.
---

# Electron Quality Gate

Read `.agents/quality-gates.md` and `references/verification.md` before validating work.

## Workflow

1. Reproduce the failure before changing expectations.
2. Identify the smallest affected boundary and test layer.
3. Use deterministic time, input, and environment controls for policy tests.
4. Run typecheck and focused tests first; broaden validation for contracts, dependencies, or process boundaries.
5. Report passed checks, skipped checks, and environment blockers separately.

## Rules

- Do not update a test merely to match a failing implementation without confirming intended behavior.
- Native failures must name Node version, ABI, package version, and rebuild/install command.
- Review lockfile changes with dependency upgrades; do not use force flags as validation evidence.
- Require independent review for security, database, migration, licensing, or release changes.
