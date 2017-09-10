
import fs from 'fs'

import {prompt} from 'inquirer'
import pkgDir from 'pkg-dir'

export async function exists (pathname) {
  try {
    await fs.statAsync(pathname)
    return true
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }

    return false
  }
}

export async function getPkgDir (pathname = '') {
  try {
    return await pkgDir(pathname)
  } catch (err) {
    console.log(err)
    return false
  }
}

export const isListItem = checklist => item => checklist.includes(item)

export async function getUserConfirm (question) {
  const key = 'confirm'
  const answers = await prompt([{
    name: key,
    type: 'confirm',
    message: question,
    default: false
  }])

  return answers[key]
}

export async function installWithMustache (from, to, data = {}) {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(to)
    writer.on('close', resolve)
    writer.on('error', reject)

    const reader = fs.createReadStream(from)
    reader.on('error', reject)

    reader.pipe(writer)
  })
}
