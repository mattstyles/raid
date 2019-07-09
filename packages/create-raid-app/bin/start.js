#! /usr/bin/env node

// require('../')
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    i: 'install-version'
  }
})

var start = argv.run
  ? require('./cmd').default
  : require('./install').default

module.exports = () => start(argv)
