
import fs from 'fs'
import path from 'path'

import chalk from 'chalk'
import { remove } from 'lodash/fp'
import spawn from 'cross-spawn'

import { viableInstallItems } from '../lib/constants'
import { isListItem, getUserConfirm, getPkgDir } from '../lib/utils'
import { installFromFolder } from '../lib/install'
import { getData, onInstallComplete } from '../tmpl/root'

const checkAgainstViableList = isListItem(viableInstallItems)
const checkItemViability = remove(checkAgainstViableList)

async function checkFolderViability (pwd) {
  const files = await fs.readdirAsync(pwd)
  return !checkItemViability(files).length
}

export default async function install (opts) {
  if (!await checkFolderViability(process.cwd())) {
    console.log(`${chalk.yellow(process.cwd())} contains files`)

    if (!await getUserConfirm('Are you sure you want to proceed?')) {
      return
    }
  }

  // Gather info
  const data = await getData()

  // Install
  const pkgpath = await getPkgDir()
  const installpath = pkgpath || process.cwd()

  await installFromFolder(
    path.resolve(__dirname, '../tmpl/root'),
    path.resolve(installpath),
    data,
    {
      root: installpath
    }
  )

  if (!opts['skip-install']) {
    console.log('\nInstalling dependencies...')
    spawn.sync('npm', ['install'], {
      cwd: installpath,
      stdio: 'inherit'
    })
  }

  await onInstallComplete({
    cwd: installpath,
    skip: opts['skip-install']
  })
}
