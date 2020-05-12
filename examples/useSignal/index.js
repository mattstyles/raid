
/**
 * The useSignal hook lets a component use a react hook (rather than
 * using the adaptor HOC or direct access) to interface with a signal.
 */

import { render } from 'react-dom'
import { Card, Flex, Text, Button } from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal } from '@raid/hooks'
import { debug } from '@raid/addons/debug'

import { App, element } from '../_common'

const signal = Signal.of({
  count: 0
})

const update = (state, event) => {
  if (event.type === 'inc') {
    return {
      ...state,
      count: state.count + 1
    }
  }

  if (event.type === 'dec') {
    return {
      ...state,
      count: state.count - 1
    }
  }

  return state
}

const Control = () => {
  const [state, dispatch] = useSignal(signal)

  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => dispatch({ type: 'inc' })}>+</Button>
        <Button tight onClick={() => dispatch({ type: 'dec' })}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${state.count}`}</Text>
    </Card>
  )
}

signal.observe(state => {
  render(
    <App state={state}>
      <Control />
    </App>,
    element
  )
})

signal.register(update)
signal.register(debug('[useSignal]'))
