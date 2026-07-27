# Template Architecture

- `electron/main/` owns lifecycle, security, modules, IPC handlers, and privileged integrations.
- `electron/preload/` exposes minimal typed APIs through `contextBridge`.
- `src/` owns React rendering and never imports Node or Electron runtime APIs.
- `src/shared/` contains contracts, types, pure policy, and module registry helpers.
- `config/` resolves feature flags and production configuration; sensitive authorization remains in main.

For an optional module, add its config entry, main registration, conditional preload exposure, renderer integration only when needed, shared contracts, and focused tests.
