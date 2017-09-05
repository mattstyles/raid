
import {commands} from './constants'

import install from '../cmd/install'
import help from '../cmd/help'

const router = {
  [commands.install]: install
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
