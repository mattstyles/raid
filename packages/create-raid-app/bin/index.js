#! /usr/bin/env node

require = require('esm')(module) // eslint-disable-line

var fs = require('fs')
var { promisifyAll } = require('bluebird')

promisifyAll(fs)
promisifyAll(require('child_process'))
promisifyAll(require('mkdirp'))

const start = require('./start')
start()
