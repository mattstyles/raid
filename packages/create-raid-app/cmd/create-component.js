
import path from 'path'

import {installFile, installFromFolder} from '../lib/install'
import {getPkgDir, rename} from '../lib/utils'

import {
  getData,
  onInstallComplete,
  onInstallCancelled
} from '../tmpl/component'

export default async function createComponent (cmds, opts) {
  const pkgpath = await getPkgDir()
  const installpath = pkgpath || process.cwd()

  const data = await getData()

  if (!data.componentName) {
    await onInstallCancelled()
    return
  }

  if (opts.complex) {
    const componentFileName = data.componentName.toLowerCase()
    await installFromFolder(
      path.resolve(__dirname, '../tmpl/component/complex'),
      path.resolve(
        installpath,
        `src/components/${componentFileName}`
      ),
      Object.assign({
        componentFileName
      }, data),
      {
        root: installpath,
        shortname: data.componentName
      }
    )

    await rename(
      path.resolve(installpath, `src/components/${componentFileName}/component.jsx`),
      path.resolve(installpath, `src/components/${componentFileName}/${componentFileName}.jsx`)
    )
  } else {
    await installFile(
      path.resolve(__dirname, '../tmpl/component/component.jsx'),
      path.resolve(
        installpath,
        'src/components/',
        data.componentName.toLowerCase() + '.jsx'
      ),
      data,
      {
        root: installpath,
        shortname: data.componentName
      }
    )
  }

  await onInstallComplete({cwd: installpath})
}
