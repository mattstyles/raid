
import path from 'path'
import child from 'child_process'

import {exists, getPkgDir} from '../lib/utils'

console.log('Create Raid App')

async function scaffoldCra (cwd, version) {
  console.log('Scaffolding into', cwd)
  // @TODO use argv.version to install a specific version of create-raid-app

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
    // @TODO perform npm i create-raid-app to get the latest
    await scaffoldCra(process.env.PWD, argv.version || '')
    return start(argv)
  }

  const cra = await exists(path.join(dirpath, 'node_modules/.bin/cra'))

  if (!cra) {
    await scaffoldCra(process.env.PWD, argv.version || '')
    return start(argv)
  }

  // @TODO otherwise call local cra with arguments to handle things
  // spawn(path.join(dirpath, 'node_modules/bin'))
  console.log('spawning local cra')
}

export default start
