
import version from './version'

import root from '../man/root'

export default cmds => {
  version()

  if (!cmds || !cmds.length) {
    console.log(root)
  }
}
