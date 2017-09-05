
import pkg from '../package.json'
import {commands} from '../lib/constants'

export default () => `
  Usage

    $ ${pkg.name} ${commands.install}

  Scaffolds raid application in to the current folder.
`
