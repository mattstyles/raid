
import {prompt} from 'inquirer'

async function gatherData () {
  const answers = await prompt([{
    name: 'projectName',
    type: 'input',
    message: 'What is the name of this awesome project?'
  }])

  return answers
}

export default gatherData
