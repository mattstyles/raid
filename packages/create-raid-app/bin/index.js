#! /usr/bin/env node

require('../')
var argv = require('minimist')(process.argv.slice(2))
var start = argv.run
  ? require('./cmd').default
  : require('./install').default

start(argv)
