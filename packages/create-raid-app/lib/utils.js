
import fs from 'fs'

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
