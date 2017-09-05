
import path from 'path'
import spawnAsync from 'cross-spawn'

import {help, version} from './man'
import {exists, getPkgDir} from '../lib/utils'

async function scaffoldCra (cwd, version) {
  if (process.env.DEBUG) {
    process.exit(0)
  }

  const cra = 'create-raid-app' + (version ? `@${version}` : '')
  console.log(`Scaffolding ${cra} in to`, cwd)
  await spawnAsync('npm', ['install', cra], {
    cwd,
    stdio: 'inherit'
  })
}

async function start (argv) {
  const dirpath = await getPkgDir()

  if (!dirpath) {
    if (argv.help) {
      help()
      return
    }

    if (argv.version) {
      version()
      return
    }

    await scaffoldCra(process.cwd(), argv['install-version'] || '')
    return start(argv)
  }

  const localPath = path.join(dirpath, 'node_modules/.bin/cra')
  const cra = await exists(localPath)

  if (!cra) {
    await scaffoldCra(process.cwd(), argv.version || '')
    return start(argv)
  }

  await spawnAsync('node', [
    localPath,
    ...process.argv.slice(2),
    '--run'
  ], {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
}

export default start
