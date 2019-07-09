
import { prompt } from 'inquirer'
import chalk from 'chalk'

export async function getData () {
  const answers = await prompt([{
    name: 'signalName',
    type: 'input',
    message: 'What is the name of this awesome signal?'
  }])

  return Object.assign({
    signalName: ''
  }, answers)
}

export async function onInstallComplete () {
  console.log('Signal created successfully', chalk.green('✔︎'))
}

export async function onInstallCancelled () {
  console.log('Signal creation cancelled', chalk.red('X'))
}
