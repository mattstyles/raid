
import pkg from '../package.json'

export default `
  Usage

    $ ${pkg.name} [command] [options]

  Arguments

    -h --help             Display contextual help for ${pkg.name} instructions
    -v --version          Display current locally installed version
`
