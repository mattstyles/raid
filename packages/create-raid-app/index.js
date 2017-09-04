
require('@std/esm')
var fs = require('fs')
var {promisifyAll} = require('bluebird')

promisifyAll(fs)
promisifyAll(require('child_process'))
promisifyAll(require('mkdirp'))
promisifyAll(require('cross-spawn'))

module.exports = require('./lib').default
