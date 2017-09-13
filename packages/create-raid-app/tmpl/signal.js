
import {prompt} from 'inquirer'

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
  console.log('Signal created successfully')
}

export async function onInstallCancelled () {
  console.log('Signal creation cancelled')
}
