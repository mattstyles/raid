
import { namespace } from './utils'

import { Signal } from 'raid'
import { adaptor } from '../src'

const test = namespace(__filename)

test('Should return functions', t => {
  t.plan(2)

  const signal = new Signal()
  const connect = adaptor(signal)
  t.equal('function', typeof connect, 'Adaptor should accept a signal and return a function')

  const hoc = connect(
    state => state,
    props => {}
  )
  t.equal('function', typeof hoc, 'Connected components should be functions')
})

test('Connect pass state through to component props', t => {
  t.plan(1)

  const signal = new Signal({ foo: 'bar' })
  const connect = adaptor(signal)

  const hoc = connect(
    state => state,
    props => {}
  )

  signal.observe(state => {
    const component = hoc()
    t.equal('bar', component.props.foo, 'Passes state as props')
  })
})

test('Connect should throw errors if arguments do not exist', t => {
  t.plan(1)

  const signal = new Signal()
  const connect = adaptor(signal)

  t.throws(() => {
    connect(null, props => {})
  }, 'Throws when no state selector is specified')
})

test('Selector functions should select from state and provide to component', t => {
  t.plan(1)

  const signal = new Signal({ foo: 'bar' })
  const connect = adaptor(signal)

  const hoc = connect(
    state => ({
      bar: state.foo
    }),
    props => {}
  )

  signal.observe(state => {
    const component = hoc()
    t.equal('bar', component.props.bar, 'Selectors pass state correctly')
  })
})

test('Selector function is optional', t => {
  t.plan(1)

  const state = { foo: 'bar' }
  const signal = new Signal(state)
  const connect = adaptor(signal)

  const hoc = connect(props => {})

  signal.observe(state => {
    const component = hoc()
    t.deepEqual(state, component.props, 'Selector defaults to identity')
  })
})

test('The observer that allows a connection can be removed', t => {
  t.plan(2)

  const signal = new Signal()
  const connect = adaptor(signal)

  t.equal(signal.observers.size, 1, 'Calling adaptor creates an observer')
  connect.detach()
  t.equal(signal.observers.size, 0, 'That observer can be removed')
})
