
import { prompt } from 'inquirer'
import chalk from 'chalk'

export async function getData () {
  const answers = await prompt([{
    name: 'componentName',
    type: 'input',
    message: 'What is the name of this awesome component?'
  }])

  return Object.assign({
    componentName: ''
  }, answers)
}

export async function onInstallComplete () {
  console.log('Component created successfully', chalk.green('✔︎'))
}

export async function onInstallCancelled () {
  console.log('Component creation cancelled', chalk.red('X'))
}
