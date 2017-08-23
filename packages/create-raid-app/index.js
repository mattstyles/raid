
require('@std/esm')
var fs = require('fs')
var {promisifyAll} = require('bluebird')

promisifyAll(fs)
promisifyAll(require('child_process'))
promisifyAll(require('mkdirp'))

module.exports = require('./lib').default
