# Verification Matrix

| Change | Minimum checks |
| --- | --- |
| Pure policy/config | `npm run typecheck`, focused unit tests |
| Renderer | typecheck, focused tests, accessibility check |
| IPC/preload/security | typecheck, contract tests, boundary review |
| Dependency | clean install when available, typecheck, affected tests, lockfile review |
| Native SQLite | Node version, ABI, `npm rebuild better-sqlite3`, database tests |
| Release | `npm run validate:release`, build, artifact/config review |

Never classify a missing credential, failed native build, or unavailable signing certificate as a passing test.
