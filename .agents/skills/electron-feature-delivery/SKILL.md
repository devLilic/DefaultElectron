---
name: electron-feature-delivery
description: Implement Electron application features safely in this template. Use for feature modules, configuration, typed IPC, preload APIs, database work, renderer integration, and changes spanning Electron main, preload, or React renderer.
---

# Electron Feature Delivery

Read `AGENTS.md`, `.agents/workflow.md`, and `references/architecture.md` before changing a feature.

## Workflow

1. Inspect the module registry, config flag, shared contract, and focused tests.
2. Define the requested behavior and which process owns it.
3. Implement privileged work in main, typed contracts in shared code, narrow exposure in preload, and UI only in renderer.
4. Register optional modules only when their configuration enables them.
5. Add focused tests and run the applicable quality gate.

## Rules

- Do not expose raw `ipcRenderer`, Node APIs, SQL, filesystem access, secrets, or complete internal config to renderer code.
- Validate untrusted IPC input in main before privileged work.
- Keep shared code pure where possible; do not introduce renderer imports into main/preload code.
