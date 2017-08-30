
import path from 'path'
import child from 'child_process'

import {exists, getPkgDir} from '../lib/utils'

console.log('Create Raid App')

async function scaffoldCra (cwd, version) {
  console.log('Scaffolding into', cwd)

  if (process.env.DEBUG) {
    process.exit(0)
  }

  const cra = 'create-raid-app' + (version ? `@${version}` : '')
  await child.spawnAsync('npm', ['install', cra], {
    cwd,
    stdio: 'inherit'
  })
}

async function start (argv) {
  const dirpath = await getPkgDir()

  if (!dirpath) {
    await scaffoldCra(process.cwd(), argv.version || '')
    return start(argv)
  }

  const localPath = path.join(dirpath, 'node_modules/.bin/cra')
  const cra = await exists(localPath)

  if (!cra) {
    await scaffoldCra(process.cwd(), argv.version || '')
    return start(argv)
  }

  await child.spawnAsync('node', [localPath, '--run'].concat(process.argv.slice(2)), {
    cwd: process.env.PWD,
    stdio: 'inherit'
  })
}

export default start
