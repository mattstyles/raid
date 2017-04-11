
import './setup'

import tape from 'tape'
import createHistory from 'history/createMemoryHistory'

import {init, initial} from '../src'

tape('Should export an init function', t => {
  t.plan(1)

  t.equal(typeof init, 'function', 'Exports an init function')
})

tape('Init should throw without a signal', t => {
  t.plan(3)

  t.throws(() => init(), 'Throws when init is supplied with nothing')
  t.throws(() => init({}), 'Throws when init is not supplied a signal')
  t.ok(init({signal: {}}), 'Ok when given a signal')
})

tape('Init should export navigator stuff', t => {
  t.plan(4)

  const {Navigator, actions, update, history} = init({signal: {}})
  t.equal(typeof Navigator, 'function', 'Navigator is a function')
  t.equal(typeof actions, 'object', 'An action object is created')
  t.equal(typeof update, 'function', 'Update is a function')
  t.equal(typeof history, 'object', 'A history object is created')
})

tape('Init should accept parameters', t => {
  t.plan(1)

  const memoryHistory = createHistory()
  const {history} = init({
    signal: {},
    history: memoryHistory
  })

  t.deepEqual(history, memoryHistory, 'Supplied history is used and returned')
})

tape('Initial state should contain stack and index', t => {
  t.plan(2)

  const navigation = initial.navigation
  const keys = Object.keys(navigation)

  t.ok(keys.includes('stack'), 'Navigation state key contains stack')
  t.ok(keys.includes('index'), 'Navigation state key contains index')
})
