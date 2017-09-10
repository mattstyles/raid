
import fs from 'fs'
import path from 'path'

import {remove} from 'lodash/fp'

import {viableInstallItems} from '../lib/constants'
import {isListItem, getUserConfirm, getPkgDir} from '../lib/utils'
import {installFromFolder} from '../lib/install'

const checkAgainstViableList = isListItem(viableInstallItems)
const checkItemViability = remove(checkAgainstViableList)

async function checkFolderViability (pwd) {
  const files = await fs.readdirAsync(pwd)
  return !checkItemViability(files).length
}

export default async function install (opts) {
  console.log('Checking ok to proceed to scaffold clean build')

  if (!await checkFolderViability(process.cwd())) {
    console.log(`${process.cwd()} contains files`)

    if (!await getUserConfirm('Are you sure you want to proceed?')) {
      return
    }

    console.log('Proceeding to scaffold clean build')
  }

  console.log('Scaffolding clean build')

  // @TODO gather user input via inquirer questions (stuff like project name etc)
  // @TODO run through the root template folder recursively creating files

  const pkgpath = await getPkgDir()
  const installpath = pkgpath || process.cwd()

  installFromFolder(
    path.resolve(__dirname, '../tmpl/root'),
    path.resolve(installpath),
    // @TODO use gathered user input
    {
      packageName: 'cra-test-install'
    }
  )
}
