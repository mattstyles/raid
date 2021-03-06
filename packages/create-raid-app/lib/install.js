
import { join, relative } from 'path'
import fs from 'fs'
import chalk from 'chalk'

import mkdirpAsync from 'mkdirp'

import { exists, getUserConfirm, installWithMustache } from './utils'
import { userCancel } from './constants'

async function installFolder (pathname, opts) {
  if (await exists(pathname)) {
    if (!await getUserConfirm(`${chalk.yellow(opts.shortname)} already exists, replace?`)) {
      return false
    }
  }

  console.log(`Creating ${chalk.yellow(opts.shortname)}`)
  await mkdirpAsync(pathname)
  return true
}

export async function installFile (from, to, data, opts) {
  if (await exists(to)) {
    if (!await getUserConfirm(`${chalk.yellow(opts.shortname)} already exists, replace?`)) {
      return Promise.reject(new Error(userCancel))
    }
  }

  console.log(`Creating ${chalk.yellow(opts.shortname)}`)
  await installWithMustache(from, to, data)
}

export async function installFromFolder (from, to, data = {}, opts = {}) {
  const fileprops = await fs.statAsync(from)
  const fileOpts = {
    shortname: relative(opts.root, to)
  }
  if (fileprops.isDirectory()) {
    if (to === opts.root || await installFolder(to, fileOpts)) {
      let files = await fs.readdirAsync(from)
      for (let file of files) {
        await installFromFolder(
          join(from, file),
          join(to, file),
          data,
          opts
        )
      }
    }

    return
  }

  try {
    await installFile(from, to, data, fileOpts)
  } catch (err) {
    if (err.message === userCancel) {
      return
    }

    throw err
  }
}
