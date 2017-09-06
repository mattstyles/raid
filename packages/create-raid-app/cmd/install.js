
import fs from 'fs'

import {remove} from 'lodash/fp'

import {viableInstallItems} from '../lib/constants'
import {isListItem, getUserConfirm} from '../lib/utils'

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
}
