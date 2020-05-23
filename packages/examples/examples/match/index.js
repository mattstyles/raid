
/**
 * Basic counter example using match to select an update to run
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action types
 */

import { render } from 'react-dom'
import { Signal } from 'raid'
import { match, debug } from '@raid/addons'

import { Spacer, Flex, Button, ButtonGroup, Card, Text } from '@raid/basic-kit'
import { App, element } from '../_common'

/**
 * The main signal can be observed for changes to application state.
 * The signal accepts a parameter which defines the initial state.
 */
const signal = new Signal({
  count: 0
})

/**
 * Actions
 */
const actions = {
  apply: 'actions:apply',
  reset: 'actions:reset'
}

/**
 * Update functions
 */
const onApply = (state, { payload }) => ({
  ...state,
  count: state.count + payload
})

const onReset = (state) => ({
  ...state,
  count: 0
})

const isType = type => event => type === event.type
const update = match([
  [isType(actions.apply), onApply],
  [isType(actions.reset), onReset]
])

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = (type, payload) => domEvent => signal.emit({ type, payload })

const Counter = ({ count }) => {
  return (
    <Card>
      <Flex row sx={{ alignItems: 'center' }}>
        <Text sx={{ px: 3, minWidth: 40, textAlign: 'center' }}>{count}</Text>
        <Spacer px={2} />
        <ButtonGroup condensed rounding='circular'>
          <Button tight onClick={dispatch(actions.apply, 1)}>+</Button>
          <Button tight onClick={dispatch(actions.apply, -1)}>-</Button>
        </ButtonGroup>
        <Spacer px={2} />
        <Button
          onClick={dispatch(actions.reset)}
          colour='critical'
        >
          Reset
        </Button>
      </Flex>
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
}, error => console.error(error))

/**
 * Register updates.
 * Returns a dispose function which can be used to destroy an update function.
 */
signal.register(update)
signal.register(debug('::'))
