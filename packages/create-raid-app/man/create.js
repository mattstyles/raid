
import pkg from '../package.json'
import {commands} from '../lib/constants'

import component from '../man/create-component'
import signal from '../man/create-signal'

const router = {
  [commands.component]: component,
  [commands.signal]: signal
}

const usage = `
  Usage

    $ ${pkg.name} ${commands.create} [type]

  Creates a new component of a specific types.

  Supported types

    component             New component
    signal                New signal
`

export default cmds => {
  if (!cmds || !cmds.length) {
    return usage
  }

  const cmd = cmds.shift()
  const help = router[cmd]

  if (!help) {
    return usage
  }

  return help(cmds)
}
