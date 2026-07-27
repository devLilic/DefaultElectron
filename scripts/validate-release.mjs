import fs from 'node:fs'

const root = new URL('../', import.meta.url)
const packageJson = JSON.parse(fs.readFileSync(new URL('package.json', root), 'utf8'))
const builder = JSON.parse(fs.readFileSync(new URL('electron-builder.json', root), 'utf8'))
const publish = Array.isArray(builder.publish) ? builder.publish[0] : undefined

if (packageJson.version === '0.1.0' || !publish?.owner || !publish?.repo ||
  publish.owner.startsWith('YOUR_') || publish.repo.startsWith('YOUR_')) {
  throw new Error('Set a release version and real GitHub owner/repository before publishing.')
}

console.log('Release configuration is valid.')
