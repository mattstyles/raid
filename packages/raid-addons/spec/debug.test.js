
import {namespace} from './utils'

import {debug} from '../src'

const test = namespace(__filename)

test('Should not mutate state', t => {
  t.plan(1)

  const state = {foo: 'bar'}
  const update = debug()

  t.equal(state, update(state, {}), 'state remains unmodified')
})

test('should throw if anything other than a string is supplied', t => {
  t.plan(1)

  t.throws(() => {
    debug({})
  }, 'throws when an object is passed to debug')
})
