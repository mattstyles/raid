
import {user} from 'osenv'
import {prompt} from 'inquirer'

async function gatherData () {
  const answers = await prompt([{
    name: 'projectName',
    type: 'input',
    message: 'What is the name of this awesome project?'
  }])

  return Object.assign(answers, {
    username: user()
  })
}

export default gatherData
