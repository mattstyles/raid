
import {prompt} from 'inquirer'

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
  console.log('Component created successfully')
}

export async function onInstallCancelled () {
  console.log('Component creation cancelled')
}
