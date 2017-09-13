
import path from 'path'

import {installFile} from '../lib/install'
import {getPkgDir} from '../lib/utils'

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

  await onInstallComplete({cwd: installpath})
}
