/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import { render } from 'react-dom'
import { Signal } from 'raid'
import { debug } from '@raid/addons'
import { union } from 'folktale/adt/union'

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
 * Tagged union for action
 */
const actions = union('actions', {
  apply: value => ({ value }),
  reset: () => {}
})

/**
 * This assumes that a folktale tagged union will output something if it
 * does not match, which is currently not the case so whilst this works, it
 * is not currently scalable.
 */
const update = (state, event) => {
  return event.matchWith({
    apply: ({ value }) => ({
      ...state,
      count: state.count + value
    }),
    reset: () => ({
      ...state,
      count: 0
    }),

    // default not implemented in folktale/union
    _: () => state
  })
}

/**
 * Action handlers are a bit of sugar to add
 */
const dispatch = type => event => signal.emit(type)

/**
 * Component to show variable and dispatch events on interaction
 */
const Counter = ({ count }) => {
  return (
    <Card>
      <Flex row sx={{ alignItems: 'center' }}>
        <Text sx={{ px: 3 }}>{count}</Text>
        <Spacer px={2} />
        <ButtonGroup condensed rounding='circular'>
          <Button tight onClick={dispatch(actions.apply(1))}>+</Button>
          <Button tight onClick={dispatch(actions.apply(-1))}>-</Button>
        </ButtonGroup>
        <Spacer px={2} />
        <Button
          onClick={dispatch(actions.reset())}
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
signal.register(debug('>>'))
signal.register(update)
signal.register(debug('<<'))
