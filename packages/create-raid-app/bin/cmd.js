
import help from '../cmd/help'
import version from '../cmd/version'
import cra from '../lib/index'
import { debug } from '../lib/utils'

export default function start (argv) {
  debug('Local program arguments', JSON.stringify(argv))

  if (argv.help) {
    help(argv._)
    return
  }

  if (argv.version) {
    version()
    return
  }

  cra(argv._, argv)
}
