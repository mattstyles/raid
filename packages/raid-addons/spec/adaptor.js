
import path from 'path'
import tape from 'tape'
import {Signal} from 'raid'

import {adaptor} from '../src'

const test = (str, fn) => tape(`${path.basename(__filename)} :: ${str}`, fn)

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

  const signal = new Signal({foo: 'bar'})
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
  t.plan(2)

  const signal = new Signal()
  const connect = adaptor(signal)

  t.throws(() => {
    connect(null, props => {})
  }, 'Throws when no state selector is specified')
  t.throws(() => {
    connect(state => state)
  }, 'Throws when no component is specified')
})

test('Selector functions should select from state and provide to component', t => {
  t.plan(1)

  const signal = new Signal({foo: 'bar'})
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
