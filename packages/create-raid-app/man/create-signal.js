
import pkg from '../package.json'
import { commands } from '../lib/constants'

export default () => `
  Usage

    $ ${pkg.name} ${commands.create} ${commands.signal}

  Creates a new signal.
`
