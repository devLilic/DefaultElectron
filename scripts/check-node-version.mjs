const requiredMajor = 22
const requiredMinor = 18
const version = process.versions.node
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
const major = match ? Number(match[1]) : NaN
const minor = match ? Number(match[2]) : NaN

if (major !== requiredMajor || minor < requiredMinor) {
  console.error(
    `Unsupported Node.js ${version}. This template requires Node ${requiredMajor}.${requiredMinor}.x because better-sqlite3 uses native binaries.\n` +
    'Windows: run `nvm install 22.18.0`, then `nvm use 22.18.0`, remove node_modules, and run `npm ci` again.',
  )
  process.exitCode = 1
}
