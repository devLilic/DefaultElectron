---
name: windows-release-readiness
description: Prepare and review Windows Electron releases in this template. Use for Electron Builder, Windows code signing, CI, GitHub Releases, versioning, auto-update, release configuration, and release artifact readiness.
---

# Windows Release Readiness

Read `docs/RELEASES.md`, `.agents/quality-gates.md`, and `references/release-inputs.md` before modifying release work.

## Workflow

1. Verify Node version, package version, app ID, GitHub repository values, and production feature flags.
2. Run release validation and inspect placeholders before building.
3. Verify signing inputs are configured without reading or exposing their values.
4. Build and inspect the Windows artifact and update metadata.
5. Report readiness; wait for explicit user approval before pushing, tagging, publishing, or invoking an installer.

## Rules

- Keep auto-update disabled unless its GitHub provider configuration is complete.
- Do not print, copy, or modify signing credentials or release secrets.
- Treat release publication as an external state change requiring explicit approval.
