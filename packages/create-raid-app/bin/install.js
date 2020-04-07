
import path from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'

import { help, version } from './man'
import { exists, getPkgDir, debug } from '../lib/utils'

async function scaffoldCra (cwd, opts) {
  debug('Installing cra locally')
  const version = opts['install-version']
  const cmd = opts['use-npm'] ? 'npm' : 'yarn'
  const cra = 'create-raid-app' + (version ? `@${version}` : '')
  console.log(`Scaffolding ${chalk.cyan(cra)} in to ${chalk.yellow(cwd)}`)
  try {
    await spawn.sync(cmd, ['install', cra], {
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
      await scaffoldCra(process.cwd(), argv || {})
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
