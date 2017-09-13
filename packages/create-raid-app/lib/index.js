
import {commands} from './constants'

import install from '../cmd/install'
import help from '../cmd/help'
import create from '../cmd/create'

const router = {
  [commands.install]: install,
  [commands.create]: create
}

export default (cmds, opts) => {
  const root = cmds.shift()

  if (!root) {
    install(opts)
    return
  }

  const cmd = router[root]

  if (!cmd) {
    help()
    return
  }

  cmd(cmds, opts)
}
