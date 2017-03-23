
import {namespace} from './utils'

import {patch} from '../src'

const test = namespace(__filename)

const createState = (key, value) => ({
  foo: 'bar',
  [key]: value
})

test('Should return a function to be used as an update', t => {
  t.plan(3)

  const single = patch('key')
  const double = patch('key', () => {})
  const addFn = single(() => {})

  t.equal(typeof single, 'function', 'Single argument returns a function')
  t.equal(typeof double, 'function', 'Two arguments returns a function')
  t.equal(typeof addFn, 'function', 'Using fixed arity returns a function')
})

test('Should throw if a key is not supplied', t => {
  t.plan(1)

  t.throws(patch, 'Key must be supplied')
})

test('Should pass through the specified keys value as state', t => {
  t.plan(1)

  const key = 'bar'
  const value = {
    baz: 'quux'
  }
  const state = createState(key, value)
  const update = patch(key, state => {
    t.deepEqual(state, value, 'Passes the key through')
  })

  update(state)
})

test('Should apply the update to correct key', t => {
  t.plan(2)

  const state = createState('bar', {baz: 'quux'})
  const expected = createState('bar', {baz: 'fred'})
  const update = state => ({baz: 'fred'})
  const patched = patch('bar', update)
  const fixedArity = patch('bar')(update)

  t.deepEqual(patched(state), expected, 'Changes applied correctly')
  t.deepEqual(fixedArity(state), expected, 'Changes applied correctly')
})
