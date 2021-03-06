
import {user} from 'osenv'
import {prompt} from 'inquirer'
import spawn from 'cross-spawn'

export async function getData () {
  const answers = await prompt([{
    name: 'projectName',
    type: 'input',
    message: 'What is the name of this awesome project?'
  }, {
    name: 'projectDescription',
    type: 'input',
    message: 'What is the description for this awesome project?'
  }])

  return Object.assign({
    username: user(),
    projectName: '@TODO Project Name',
    projectDescription: '@TODO project description'
  }, answers)
}

export async function onInstallComplete ({cwd, skip}) {
  if (skip) {
    return
  }

  spawn.sync('npm', ['start'], {
    cwd,
    stdio: 'inherit'
  })
}
