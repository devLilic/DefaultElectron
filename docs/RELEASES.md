# Windows releases and auto-update

1. Run the initializer with the `autoUpdate` module and provide the GitHub owner, repository and visibility.
2. Configure `WINDOWS_CERTIFICATE_BASE64` and `WINDOWS_CERTIFICATE_PASSWORD` as GitHub Actions secrets.
3. Set the production update variables in `.env.production.example`; placeholders are rejected by `npm run validate:release`.
4. Run `npm ci`, `npm test`, and `npm run build` locally with Node `22.18.0`.
5. Push a semver tag such as `v1.2.3`. The release workflow builds the NSIS installer and publishes it to GitHub Releases.

Auto-update is inactive in development and remains disabled until the production feature flag and provider configuration are complete.
