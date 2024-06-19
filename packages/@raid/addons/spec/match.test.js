
import { namespace } from './utils'

import { match } from '../src'

const test = namespace(__filename)

const createState = (key, value) => ({
  foo: 'bar',
  [key]: value
})

test('Should return a function to be used as an update', t => {
  t.plan(1)

  const predicate = () => true
  const arm = state => state
  const update = match([[predicate, arm]])

  t.equal(typeof update, 'function', 'match returns a function')
})

test('Should match on a predicate', t => {
  t.plan(2)

  const type = 'foo'
  const event = { type }
  const predicate = type => event => event.type === type
  const identity = (state, event) => state

  const update = match([
    [predicate(type), (state, event) => {
      t.equal(event.type, type, 'predicate matches on events')
    }]
  ])

  update({}, event)

  const testPredicate = match([
    [e => {
      t.equal(e, event, 'event is passed to the predicate')
    }, identity]
  ])

  testPredicate({}, event)
})

test('Should apply a default case', t => {
  t.plan(1)

  const state = createState('bar')

  const update = match([])

  const newState = update(state, { type: 'no_match' })
  t.equal(newState, state, 'default case returns the state unmodified')
})

test('Should throw if not supplied with a correct array structure', t => {
  t.plan(1)

  t.throws(() => {
    match('foobarbaz')
  }, 'matcher should be of the correct form')
})
