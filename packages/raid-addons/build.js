
/**
 * Enables `import { adaptor } from '@raid/addons/adaptor'` as tree
 * shaking is unreliable.
 *
 * Transpiles and places files at root. As there are a couple with
 * dependencies they become available via direct import, (they aren't
 * added to the main exports) but that's ok for now.
 */

// npx babel src --ignore index.js -d ./

const { spawn } = require('child_process')

spawn('npx', [
  'babel', 'src',
  '--ignore', 'src/index.js',
  '-d', './'
], {
  stdio: 'inherit'
})
