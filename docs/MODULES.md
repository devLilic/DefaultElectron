# Optional modules

The default starter enables only logging. Select modules with `npm run init:starter` or pass `--modules=logging,i18n`.

## i18n

Set the default and supported languages in `.env.production.example`; user-facing text belongs in locale namespaces.

## Database

Uses Node's built-in `node:sqlite` driver through Drizzle. SQLite runs in Electron main and stores its database under the app's user data directory. The connection enables foreign keys and write-ahead logging for file-backed databases. Local tests use Node 24 LTS, and packaged apps use Electron's bundled Node runtime.

## Auto update

Requires a GitHub Releases repository, Windows code signing, and the release workflow described in `RELEASES.md`.

## Licensing and app protection

Both stay disabled unless a production provider and policy are configured. Do not put credentials in renderer code or environment variables bundled into the application.
