
const tape = require('tape')
const {uid, fold} = require('../lib/utils')

tape('uid should return a unique identifier string', t => {
  t.plan(2)

  t.equal(typeof uid(), 'string', 'Should return a string')
  t.notEqual(uid(), uid(), 'The chance of two being the same is tiny, if this is failing you should buy a lottery ticket')
})

tape('fold should traverse an iterator invoking functions', t => {
  t.plan(1)

  var m = new Map()
  m.set('test', val => ++val)

  let output = fold(m.values(), (v, k) => {
    return k(v)
  }, 0)

  t.equal(output, 1, 'Fold should pass through a function')
})

tape('fold should handle several values', t => {
  t.plan(1)

  var m = new Map()
  m.set('test', val => ++val)
  m.set('test1', val => val + 10)

  let output = fold(m.values(), (v, k) => {
    return k(v)
  }, 0)

  t.equal(output, 11, 'Fold should pass through several functions')
})
