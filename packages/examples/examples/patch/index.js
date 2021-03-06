
import { render } from 'react-dom'

import { Signal } from 'raid'
import { patch } from '@raid/addons'

import { Spacer, Button, Text } from '@raid/basic-kit'
import { App, element } from '../_common'

const signal = new Signal({
  patched: {
    foo: 'bar'
  }
})

const actions = {
  foo: 'bar'
}

const dispatch = type => payload => signal.emit({ type, payload })
const toggle = (a, b) => cond => cond === a ? b : a
const toggleFoo = toggle('quux', 'bar')

const update = (state, event) => {
  const { foo } = state
  return {
    ...state,
    foo: toggleFoo(foo)
  }
}

// Either form of patch() will work
// signal.register(patch('patched', update))
signal.register(patch('patched')(update))

signal.observe(state => {
  render(
    <App state={state}>
      <Button onClick={dispatch(actions.foo)}>Click me</Button>
      <Spacer py={2} />
      <Text block size={6}>{state.patched.foo}</Text>
    </App>,
    element
  )
})
