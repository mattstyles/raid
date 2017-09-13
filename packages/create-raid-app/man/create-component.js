
import pkg from '../package.json'
import {commands} from '../lib/constants'

export default () => `
  Usage

    $ ${pkg.name} ${commands.create} ${commands.component}

  Creates a new component.
`
