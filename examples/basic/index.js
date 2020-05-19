/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import { render } from 'react-dom'

import { Signal } from 'raid'

import { Flex, Card, Text, Button } from '@raid/basic-kit'
import { App, element } from '../_common'

/**
 * The main signal can be observed for changes to application state.
 * The signal accepts a parameter which defines the initial state.
 */
const signal = Signal.of({
  count: 0
})

/**
 * Action enum gives the updates a key to perform mutations
 */
const actions = {
  apply: 'actions:apply'
}

/**
 * updates are responsible for mutating state and returning it.
 * They can be composed to provide more complex state manipulation.
 * They can perform mutations, or return new objects.
 */
const update = (state, event) => {
  if (event.type === actions.apply) {
    state.count += event.payload
    return state
  }

  return state
}

/**
 * Raid can be used with any view layer, React and @raid/basic-kit is
 * used only for ease and brevity here.
 */
const Counter = ({ count }) => {
  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => signal.emit({ type: actions.apply, payload: 1 })}>+</Button>
        <Button tight onClick={() => signal.emit({ type: actions.apply, payload: -1 })}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${count}`}</Text>
    </Card>
  )
}

/**
 * The signal observer notifies when the application state changes
 */
signal.observe(state => {
  render(
    <App state={state}>
      <Counter count={state.count} />
    </App>,
    element
  )
})

/**
 * Register updates.
 * Returns a dispose function which can be used to destroy an update function.
 */
signal.register(update)
