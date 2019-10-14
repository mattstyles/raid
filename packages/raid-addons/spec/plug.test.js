
import { namespace } from './utils'

import { Signal } from 'raid'
import { plug } from '../src'

const test = namespace(__filename)

test('Should return functions', t => {
  t.plan(2)

  const signal = new Signal()
  const connect = plug(signal)
  t.equal('function', typeof connect, 'Plug should accept a signal and return a function')

  const hof = connect(
    state => state,
    props => {}
  )
  t.equal('function', typeof hof, 'Higher order functions should be functions')
})

test('Connect passes state the higher order function', t => {
  t.plan(1)

  const signal = new Signal({ foo: 'bar' })
  const connect = plug(signal)

  const hof = connect(
    state => state,
    function (state) {
      t.equal('bar', state.foo, 'Passes state as props')
    }
  )

  signal.observe(state => {
    hof()
  })
})

test('Connect should throw errors if arguments do not exist', t => {
  t.plan(1)

  const signal = new Signal()
  const connect = plug(signal)

  t.throws(() => {
    connect(null, props => {})
  }, 'Throws when no state selector is specified')
})

test('Selector functions should select from state and provide to function', t => {
  t.plan(1)

  const signal = new Signal({ foo: 'bar' })
  const connect = plug(signal)

  const hof = connect(
    state => ({
      bar: state.foo
    }),
    state => {
      t.equal('bar', state.bar, 'Selectors pass state correctly')
    }
  )

  signal.observe(state => {
    hof()
  })
})

test('Selector function is optional', t => {
  t.plan(1)

  const state = { foo: 'bar' }
  const signal = new Signal(state)
  const connect = plug(signal)

  const hof = connect(_ => {
    t.deepEqual(state, _, 'Selector defaults to identity')
  })

  signal.observe(state => {
    hof()
  })
})

test('Higher order function parameters are also passed through', t => {
  t.plan(2)

  const state = { foo: 'bar' }
  const pass = { bar: 'baz' }
  const signal = new Signal(state)
  const connect = plug(signal)

  const hof = connect(
    _ => _,
    (connected, passed) => {
      t.deepEqual(state, connected, 'State is passed through')
      t.deepEqual(pass, passed, 'Instance data is passed through')
    }
  )

  signal.observe(state => {
    hof(pass)
  })
})
