
import pkg from '../package.json'
import { commands } from '../lib/constants'

export default () => `
  Usage

    $ ${pkg.name} ${commands.install} [options]

  Scaffolds raid application in to the current folder.

  Arguments

       --skip-install        Skips the dependency install step
    -i --install-version     Installs a specific ${pkg.name} version locally
       --use-npm             Use npm instead of yarn to install dependencies        
`
