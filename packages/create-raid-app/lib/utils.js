
import fs from 'fs'

import es from 'event-stream'
import mustache from 'mustache'
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

const mustacheStream = data => es.through(function write (chunk) {
  this.emit('data', mustache.render(chunk.toString(), data))
})

export async function installWithMustache (from, to, data = {}) {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(to)
    writer.on('close', resolve)
    writer.on('error', reject)

    const reader = fs.createReadStream(from)
    reader.on('error', reject)

    reader
      .pipe(mustacheStream(data))
      .pipe(writer)
  })
}
