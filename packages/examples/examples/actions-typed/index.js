/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action types
 */

import { render } from 'react-dom'
import { Signal } from 'raid'
import { connect } from '@raid/fl'
import { match } from '@raid/addons'

import { Spacer, Flex, Button, ButtonGroup, Card, Text } from '@raid/basic-kit'
import { App, element } from '../_common'

/**
 * The main signal can be observed for changes to application state.
 * The signal accepts a parameter which defines the initial state.
 */
const signal = new Signal({
  count: 0
})

const createActions = connect(signal)

/**
 * Create actions
 */
var [apply, reset] = createActions([
  'apply',
  'reset'
])

/**
 * Update functions
 */
const onApply = (state, event) => ({
  ...state,
  count: state.count + event.join()
})

const onReset = (state, event) => ({
  ...state,
  count: 0
})

const update = match([
  [apply.is, onApply],
  [reset.is, onReset]
])

/**
 * Components to visualise data and respond to interactions by triggering events
 */
const Counter = ({ count }) => {
  return (
    <Card>
      <Flex row sx={{ alignItems: 'center' }}>
        <Text sx={{ px: 3, minWidth: 40, textAlign: 'center' }}>{count}</Text>
        <Spacer px={2} />
        <ButtonGroup condensed rounding='circular'>
          <Button tight onClick={event => apply.of(1)}>+</Button>
          <Button tight onClick={event => apply.of(-1)}>-</Button>
        </ButtonGroup>
        <Spacer px={2} />
        <Button
          onClick={event => reset.of()}
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
