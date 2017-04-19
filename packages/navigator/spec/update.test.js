
import './setup'

import tape from 'tape'
import {Signal} from 'raid'

import {actions} from '../src/actions'
import {
  DEFAULT_KEY,
  selector,
  initial,
  setInitial,
  update
} from '../src/update'

const hasKeys = keys => obj => {
  const hostKeys = Object.keys(obj)
  return keys.reduce((flag, key) => {
    return flag === false
      ? false
      : hostKeys.includes(key)
  }, true)
}

tape('Should export a default key', t => {
  t.plan(1)

  t.ok(DEFAULT_KEY, 'default key is exposed')
})

tape('Selector should pluck the key from state', t => {
  t.plan(2)

  const defaultState = {
    navigation: 'foo'
  }

  t.equal(selector()(defaultState), 'foo', 'Default key is used')

  const key = '_nav'
  const state = {
    '_nav': 'bar'
  }

  t.equal(selector(key)(state), 'bar', 'Specified key is used')
})

tape('Initial state should include stack and index keys', t => {
  t.plan(3)

  const defaultKey = 'navigation'
  const has = hasKeys(['stack', 'index'])
  const state = initial[defaultKey]

  t.ok(state, 'Initial state has navigation key')
  t.equal(typeof state, 'object', 'navigation member is an object')
  t.ok(has(state), 'navigation member has specific keys')
})

tape('setInitial should set the key for the navigator', t => {
  t.plan(3)

  const key = '_nav'
  const has = hasKeys(['stack', 'index'])
  const state = setInitial({key})
  const nav = state[key]

  t.ok(nav, 'Initial state has specified key')
  t.equal(typeof nav, 'object', 'key member is an object')
  t.ok(has(nav), 'key member has specific keys')
})

tape('setInitial can accept a different storage method', t => {
  t.plan(4)

  const storage = {
    getItem: () => '{"foo": "bar"}'
  }
  const state = setInitial({storage})
  const nav = state.navigation

  t.ok(nav, 'State has default key')
  t.deepEqual(nav, {foo: 'bar'})

  const state2 = setInitial({
    storage,
    key: 'foo'
  })
  const nav2 = state2.foo

  t.ok(nav2, 'State has specified key')
  t.deepEqual(nav2, {foo: 'bar'})
})

tape('Pop event should add a new route to the state if unfound', t => {
  t.plan(2)

  const signal = new Signal(initial)

  signal.register(update)
  signal.register((state, event) => {
    const {stack, index} = state.navigation
    t.equal(stack.length, 2, 'New route added')
    t.equal(index, 0, 'Pop assumes moving backwards')
  })

  signal.emit({
    type: actions.pop,
    payload: {
      location: '/',
      pathname: 'test'
    }
  })
})

tape('Push event should add a new route to the tail of the list', t => {
  t.plan(2)

  const signal = new Signal(initial)

  signal.register(update)
  signal.register((state, event) => {
    const {stack, index} = state.navigation
    t.equal(stack.length, 2, 'New route added')
    t.equal(index, 1, 'Push moves to the end of the list')
  })

  signal.emit({
    type: actions.push,
    payload: {
      location: '/'
    }
  })
})

tape('Push event should add a new route to the middle of a navigation stack', t => {
  t.plan(3)

  let state = setInitial({key: 'navigation'})
  state.navigation.stack.push({})
  state.navigation.stack.push({})

  t.equal(state.navigation.stack.length, 3, 'Initial stack contains 3 routes')

  const signal = new Signal(state)

  signal.register(update)
  signal.register((state, event) => {
    const {stack, index} = state.navigation
    t.equal(stack.length, 2, 'New route added')
    t.equal(index, 1, 'Push mutates the navigation stack')
  })

  signal.emit({
    type: actions.push,
    payload: {
      location: '/'
    }
  })
})
