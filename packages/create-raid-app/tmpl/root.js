
import {user} from 'osenv'
import {prompt} from 'inquirer'
import spawn from 'cross-spawn'

export async function getData () {
  const answers = await prompt([{
    name: 'projectName',
    type: 'input',
    message: 'What is the name of this awesome project?'
  }])

  return Object.assign(answers, {
    username: user()
  })
}

export async function onInstallComplete ({cwd}) {
  spawn.sync('npm', ['start', '--', '-o'], {
    cwd,
    stdio: 'inherit'
  })
}
