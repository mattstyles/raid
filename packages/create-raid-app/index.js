

console.log('mangling require')
var fs = require('fs')
var { promisifyAll } = require('bluebird')

promisifyAll(fs)
promisifyAll(require('child_process'))
promisifyAll(require('mkdirp'))

require = require('esm')(module)
module.exports = require('./lib')
