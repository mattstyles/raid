
import minimist from 'minimist'

import cmd from './cmd'
import install from './install'

var argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    i: 'install-version'
  }
})

var start = argv.run
  ? cmd
  : install

module.exports = () => start(argv)
