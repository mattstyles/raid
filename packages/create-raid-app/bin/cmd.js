
import help from '../cmd/help'
import version from '../cmd/version'
import cra from '../lib/index'

export default function start (argv) {
  if (process.env.DEBUG) {
    console.log('DBEUG: local program arguments', argv)
  }

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
