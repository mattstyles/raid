
import path from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'

import { help, version } from './man'
import { exists, getPkgDir, debug } from '../lib/utils'

async function scaffoldCra (cwd, version) {
  debug('Installing cra locally')
  const cra = 'create-raid-app' + (version ? `@${version}` : '')
  console.log(`Scaffolding ${chalk.cyan(cra)} in to ${chalk.yellow(cwd)}`)
  try {
    await spawn.sync('npm', ['install', cra], {
      cwd,
      stdio: 'inherit'
    })
  } catch (err) {
    return Promise.reject(err)
  }

  return Promise.resolve()
}

async function start (argv) {
  const pkgpath = await getPkgDir()
  const dirpath = pkgpath || ''

  const localPath = path.join(dirpath, 'node_modules/.bin/create-raid-app')
  const cra = await exists(localPath)

  if (!cra) {
    if (argv.help) {
      help()
      return
    }

    if (argv.version) {
      version()
      return
    }

    try {
      await scaffoldCra(process.cwd(), argv['install-version'] || '')
    } catch (err) {
      console.error(err)
      process.exit(0)
    }

    return start(argv)
  }

  await spawn.sync('node', [
    localPath,
    ...process.argv.slice(2),
    '--run'
  ], {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
}

export default start
