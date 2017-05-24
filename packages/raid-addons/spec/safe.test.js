
import {namespace} from './utils'

import {safe} from '../src'

const test = namespace(__filename)

test('Should default to return state even when not explicitly returned from update', t => {
  t.plan(2)

  const state = {foo: 'bar'}
  const reg = safe(() => {})

  t.deepEqual(reg(state, null), state,
    'Returns state when register function does not')

  const update = safe((state, event) => {
    state.bar = 'quux'
  })
  const expected = {
    foo: 'bar',
    bar: 'quux'
  }
  t.deepEqual(update(state, null), expected,
    'Returns mutated state even when not explicitly returned')
})

test('Should return whatever the update function returns', t => {
  t.plan(1)

  const state = {foo: 'bar'}
  const expected = {bar: 'quux'}
  const update = safe(state => expected)

  t.deepEqual(update(state), expected, 'Returns update return')
})

test('Should accept falsy values as valid returns', t => {
  t.plan(1)

  const state = {foo: 1}
  const expected = {foo: null}
  const update = safe(state => expected)

  t.deepEqual(update(state), expected, 'Returns null as valid')
})
