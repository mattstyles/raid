
/**
 * The useSignal hook, if not supplied with a signal to work with, will
 * attempt to use one from the context.
 */

import { render } from 'react-dom'
import { Card, Flex, Text, Button } from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal, SignalProvider } from '@raid/hooks'
import { debug } from '@raid/addons/debug'
import { safe } from '@raid/addons/safe'

import { App, element } from '../_common'

const signal = Signal.of({
  count: 0
})

const namedActions = {
  apply: 'counter:apply'
}
const actions = {
  apply: (value = 1) => ({
    type: namedActions.apply,
    payload: { value }
  })
}
const update = safe((state, event) => {
  if (event.type === namedActions.apply) {
    return {
      ...state,
      count: state.count + event.payload.value
    }
  }
})

signal.register(debug('[counter]'))
signal.register(update)

const Counter = () => {
  const [state, dispatch] = useSignal()

  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => dispatch(actions.apply(1))}>+</Button>
        <Button tight onClick={() => dispatch(actions.apply(-1))}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${state.count}`}</Text>
    </Card>
  )
}

signal.observe(state => {
  render(
    <App state={state}>
      <SignalProvider signal={signal}>
        <Counter />
      </SignalProvider>
    </App>,
    element
  )
})
