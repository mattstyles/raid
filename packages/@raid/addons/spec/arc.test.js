
import 'regenerator-runtime/runtime'

import { namespace } from './utils'

import { Signal } from 'raid'
import { arc } from '../src'

const test = namespace(__filename)

test('Should provide a function for update function to grab current state', t => {
  t.plan(1)

  const update = (getState, event) => {
    t.equal(typeof getState, 'function', 'get state should be a function')
  }

  const fn = arc(new Signal())(update)
  fn(null)
})

test('Should provide the signal to the update function', t => {
  t.plan(1)

  const signal = new Signal()
  const update = (getState, event, s) => {
    t.deepEqual(s, signal, 'signal should be the correct signal')
  }

  const fn = arc(signal)(update)
  fn(null)
})

test('Should grab the correct state', t => {
  t.plan(2)

  let count = 0

  const signal = new Signal({
    foo: 'bar'
  })
  const change = (state, event) => {
    if (event.type !== 'change') {
      return state
    }
    return {
      ...state,
      foo: 'quux'
    }
  }
  const update = (getState, event, s) => {
    count += 1

    if (count === 1) {
      t.deepEqual(getState(), {
        foo: 'bar'
      }, 'initial state is correct')
      signal.emit({ type: 'change' })
      return
    }

    if (count === 2) {
      // this is the change iteration, just bail
      return
    }

    if (count === 3) {
      t.deepEqual(getState(), {
        foo: 'quux'
      }, 'state is collected correctly')
      return
    }

    t.fail('should never reach here')
  }

  const ion = arc(signal)
  signal.register(change)
  signal.register(ion(update))

  signal.emit({})
  setTimeout(() => {
    signal.emit({})
  }, 20)
})

test('Should asynchronously grab fresh state', t => {
  t.plan(2)

  const signal = new Signal({
    count: 0
  })

  const change = (state, event) => {
    if (event.type !== 'change') {
      return state
    }
    return {
      count: state.count + 1
    }
  }

  const delay = ms => ({
    then: cb => setTimeout(cb, ms)
  })

  const arcas = async (getState, event, s) => {
    if (event.type === 'change') {
      return
    }
    t.deepEqual(getState(), {
      count: 0
    }, 'initial state is correct')

    signal.emit({ type: 'change' })
    await delay(200)

    t.deepEqual(getState(), {
      count: 1
    }, 'getState grabs fresh state')
    t.end()
  }

  const ion = arc(signal)
  signal.register(change)
  signal.register(ion(arcas))
  signal.emit({})
})
