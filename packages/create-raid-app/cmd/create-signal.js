
import path from 'path'

import {installFile} from '../lib/install'
import {getPkgDir} from '../lib/utils'

import {
  getData,
  onInstallComplete,
  onInstallCancelled
} from '../tmpl/signal'

export default async function createSignal (cmds, opts) {
  const pkgpath = await getPkgDir()
  const installpath = pkgpath || process.cwd()

  const data = await getData()

  if (!data.signalName) {
    await onInstallCancelled()
    return
  }

  await installFile(
    path.resolve(__dirname, '../tmpl/signal/signal.js'),
    path.resolve(
      installpath,
      'src/signals/',
      data.signalName.toLowerCase() + '.js'
    ),
    data,
    {
      root: installpath,
      shortname: data.signalName
    }
  )

  await onInstallComplete({cwd: installpath})
}
