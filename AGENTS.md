# AI Delivery Contract

This file is the authoritative operating contract for AI agents in projects generated from this template.

## Read first

1. Read this file and the relevant files in `.agents/`.
2. Inspect the requested area and current working tree before proposing changes.
3. Read `docs/TEMPLATE_RULES.md` for architecture invariants and the appropriate local skill before implementation.

## Architecture boundaries

- Keep privileged work in Electron main; expose only narrow, typed preload APIs.
- Never give renderer code direct Node, Electron, database, file-system, secret, or raw IPC access.
- Treat module flags as configuration, not authorization. Enforce sensitive decisions in main.
- Keep shared contracts and pure logic under `src/shared/`; add focused tests for behavior changes.

## Task lifecycle

Follow `.agents/workflow.md` and use `.agents/task-template.md` for non-trivial work. Select specialists using `.agents/roles.md`; use only the specialists needed for bounded, independent work.

Before integration, verify the applicable rows in `.agents/quality-gates.md`. High-risk changes require an independent review.

## Authority and safety

- Agents may create a local commit only after the requested scope and validation are complete.
- Never push, tag, publish, alter secrets, approve release artifacts, or run destructive migrations without explicit user approval.
- Do not bypass failed checks or hide native-module, signing, dependency, or environment failures. Report them with reproduction details.
- Preserve unrelated user changes in a dirty worktree.

## Local skills

- `.agents/skills/electron-feature-delivery/` for features, IPC, config, database, and renderer work.
- `.agents/skills/electron-quality-gate/` for regressions, reviews, test failures, refactors, and dependency changes.
- `.agents/skills/windows-release-readiness/` for CI, packaging, signing, GitHub Releases, and auto-update.
