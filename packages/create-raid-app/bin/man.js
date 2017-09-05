
import pkg from '../package.json'

export const help = () => console.log(`
  ${pkg.name} (Global) ${pkg.version}

  Usage

    $ ${pkg.name}

  Installs local version of ${pkg.name}

  Arguments

    -h --help             Display help instructions for installing ${pkg.name}
    -v --version          Display current globally installed version
    -i --install-version  Install specific local version
`)

export const version = () => console.log(`
  ${pkg.name} (Global) ${pkg.version}
`)
