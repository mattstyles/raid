
import {commands} from '../lib/constants'
import component from './create-component'
import signal from './create-signal'
import help from '../man/create'

const router = {
  [commands.component]: component,
  [commands.signal]: signal
}

export default async function create (cmds, opts) {
  const cmd = cmds.shift()
  const route = router[cmd]

  if (!cmd || !route) {
    console.log(help(cmds))
    return
  }

  await route(cmds, opts)
}
