# Quality Gates

| Change type | Required verification | Required specialist/review |
| --- | --- | --- |
| Documentation or agent contract | link check, policy scan for prohibited authority | Coordinator |
| Renderer feature | typecheck, focused tests, accessibility review | React + Quality |
| Config or module flag | config tests, typecheck | Architecture or Quality |
| IPC, preload, BrowserWindow, permissions | typecheck, focused contract tests, boundary review | Electron Security + Independent Reviewer |
| Database, migration, native dependency | reproduction, focused tests, ABI/Node compatibility check | Architecture + Quality + Independent Reviewer |
| Dependency upgrade or refactor | reproduction, typecheck, affected tests, lockfile review | Quality |
| CI, packaging, signing, release, auto-update | release validation, clean-install check, artifact/config review | Release + Independent Reviewer |

Always record skipped checks and their cause. A failing native module or unavailable credential is a reported limitation, never a reason to mark validation successful.
