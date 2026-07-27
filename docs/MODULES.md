# Optional modules

The default starter enables only logging. Select modules with `npm run init:starter` or pass `--modules=logging,i18n`.

## i18n

Set the default and supported languages in `.env.production.example`; user-facing text belongs in locale namespaces.

## Database

Uses SQLite through Drizzle. Install with the Node version in `.node-version`, then run `npm rebuild better-sqlite3` after changing Node versions.

## Auto update

Requires a GitHub Releases repository, Windows code signing, and the release workflow described in `RELEASES.md`.

## Licensing and app protection

Both stay disabled unless a production provider and policy are configured. Do not put credentials in renderer code or environment variables bundled into the application.
