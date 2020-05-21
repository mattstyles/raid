
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
  if (event.type === 'apply') {
    return {
      ...state,
      count: state.count + event.payload
    }
  }

  return state
}

const Control = () => {
  const { state, emit } = useSignal(signal)

  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => emit({ type: 'apply', payload: 1 })}>+</Button>
        <Button tight onClick={() => emit({ type: 'apply', payload: -1 })}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${state.count}`}</Text>
    </Card>
  )
}

const AppViewer = ({ children }) => {
  const { state } = useSignal(signal)

  return (
    <App state={state}>
      {children}
    </App>
  )
}

render(
  <AppViewer>
    <Control />
  </AppViewer>,
  element
)

signal.register(update)
signal.register(debug('[useSignal]'))

// This is an anti-pattern when using hooks. This pattern of observing one single stream and rendering an entire tree will cause duplicate renders as this observer fires, and then child observers (i.e. those from useSignal hooks) fire.
// signal.observe(state => {
//   render(
//     <App state={state}>
//       <Control />
//       <Spacer py={3} />
//       <StateTest />
//     </App>,
//     element
//   )
// })
