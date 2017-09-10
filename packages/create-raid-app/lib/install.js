
import {join} from 'path'
import {statAsync, readdirAsync} from 'fs'

import mkdirpAsync from 'mkdirp'

import {exists, getUserConfirm, installWithMustache} from './utils'

async function installFolder (pathname) {
  if (await exists(pathname)) {
    if (!await getUserConfirm(`${pathname} already exists, replace?`)) {
      return false
    }
  }

  console.log(`Creating ${pathname}`)
  await mkdirpAsync(pathname)
  return true
}

async function installFile (from, to, data) {
  if (await exists(to)) {
    if (!await getUserConfirm(`${to} already exists, replace?`)) {
      return Promise.reject(new Error('User cancel'))
    }
  }

  console.log(`Creating ${to}`)
  await installWithMustache(from, to, data)
}

export async function installFromFolder (from, to, data = {}) {
  const fileprops = await statAsync(from)
  if (fileprops.isDirectory()) {
    if (await installFolder(to)) {
      let files = await readdirAsync(from)
      for (let file of files) {
        await installFromFolder(
          join(from, file),
          join(to, file),
          data
        )
      }
    }

    return
  }

  await installFile(from, to, data)
}
