
import {namespace, noop} from './utils'

import {scope} from '../src'

const test = namespace(__filename)

test('Should return state when function predicate does not match', t => {
  t.plan(2)

  const expected = {quux: 'fred'}
  const state = {foo: 'bar'}
  const scoped = scope(
    (state, event) => event,
    (state, event) => expected
  )

  t.deepEqual(scoped(state, false), state,
    'Does not evaluate update if predicate does not match')

  t.deepEqual(scoped(state, true), expected,
    'Evaluates update if predicate matches')
})

test('Should pass through state and event to predicate', t => {
  t.plan(2)

  const expectedState = {foo: 'bar'}
  const expectedEvent = {quux: 'fred'}
  const scoped = scope((state, event) => {
    t.deepEqual(state, expectedState, 'State matches')
    t.deepEqual(event, expectedEvent, 'Event matches')
  })

  scoped(noop)(expectedState, expectedEvent)
})

test('Should allow single or dual arity invocation', t => {
  t.plan(2)

  t.equal(typeof scope(noop), 'function', 'Function returned')
  t.equal(typeof scope(noop, noop), 'function', 'Function returned')
})

test('Should match against different predicate types', t => {
  t.plan(4)

  const state = {foo: 'bar'}
  const expected = {quux: 'fred'}
  const event = {type: 'foo'}
  const update = () => expected

  t.deepEqual(scope('foo', update)(state, event), expected,
    'Matches event type against a string')
  t.deepEqual(scope('foo', update)(state, 'foo'), expected,
    'Matches event string against a string')
  t.deepEqual(scope(/^foo/, update)(state, event), expected,
    'Matches event type against a regex')
  t.deepEqual(scope(/^foo/, update)(state, 'foobar'), expected,
    'Matches event string against a regex')
})
