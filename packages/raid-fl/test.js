
var {createAction} = require('./lib')
var A = createAction('action')
var a = A.of(1)

console.log('--', a)
console.log('--', a.map, a.chain, a.ap)
console.log('--', a['fantasy-land/ap'])
