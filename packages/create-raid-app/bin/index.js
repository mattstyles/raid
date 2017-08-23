#! /usr/bin/env node

require('../')
var start = require('./cmd').default
var argv = require('minimist')(process.argv.slice(2))

start(argv)
