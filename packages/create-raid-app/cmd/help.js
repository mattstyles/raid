
import version from './version'
import {commands} from '../lib/constants'

import root from '../man/root'
import install from '../man/install'

const router = {
  [commands.install]: install
}

export default cmds => {
  version()

  if (!cmds || !cmds.length) {
    console.log(root())
    return
  }

  const cmd = cmds.shift()
  const help = router[cmd]

  if (!help) {
    console.log(root())
    return
  }

  console.log(help(cmds))
}
