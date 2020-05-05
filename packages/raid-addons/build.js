
// npx babel src --ignore index.js -d ./

const { spawn } = require('child_process')

spawn('npx', [
  'babel', 'src',
  '--ignore', 'src/index.js',
  '-d', './'
], {
  stdio: 'inherit'
})
