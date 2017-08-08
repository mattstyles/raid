
import {render} from 'react-dom'

import {Signal} from 'raid/src'
import patch from 'raid-addons/src/patch'

import element from '../_common/element'
import Button from '../_common/actionButton'
import {App} from '../_common/layout'

const signal = new Signal({
  patched: {
    foo: 'bar'
  }
})

const actions = {
  'foo': 'bar'
}

const dispatch = type => payload => signal.emit({type, payload})
const toggle = (a, b) => cond => cond === a ? b : a
const toggleFoo = toggle('quux', 'bar')

const update = (state, event) => {
  const {foo} = state
  return {
    ...state,
    foo: toggleFoo(foo)
  }
}

// signal.register(patch('patched', update))
signal.register(patch('patched')(update))

signal.observe(state => {
  render(
    <App state={state}>
      <Button onClick={dispatch(actions.foo)}>Click me</Button>
    </App>,
    element
  )
})
