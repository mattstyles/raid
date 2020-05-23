/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action types
 */

import { render } from 'react-dom'
import { Signal } from 'raid'
import { connect, typeEvent, untypeEvent } from '@raid/fl'
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

const createActions = connect(signal)

/**
 * Create actions
 */
const [apply, reset] = createActions([
  'apply',
  'reset'
])
const regularAction = 'action::stringForm'

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

const onRegularAction = (state, event) => {
  console.log('regular action')
  return state
}

const isType = type => event => event['@@type']
  ? type === event['@@type']
  : false

const update = match([
  [apply.is, onApply],
  [reset.is, onReset],
  [isType(regularAction), onRegularAction]
])

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = type => event => signal.emit({ type })

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
        <ButtonGroup ix={1}>
          <Button
            onClick={event => reset.of()}
            colour='critical'
          >
            Reset
          </Button>
          <Button
            onClick={dispatch(regularAction)}
            variant='primary'
          >
            String Event
          </Button>
        </ButtonGroup>
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
const eventStore = {}
signal.register(typeEvent(update, eventStore))
signal.register(untypeEvent((state, event) => {
  console.log('untyped::', event)
  return state
}))

signal.register(debug('>>'))

// signal.register((state, event) => {
//   console.log(state, '::', event)
//   return state
// })
