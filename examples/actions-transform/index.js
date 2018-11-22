/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action types
 */

import {render} from 'react-dom'
import {Signal} from 'raid'
import {connect, typeEvent, untypeEvent} from 'raid-fl'
import {match, debug} from 'raid-addons'

import {App, Button, element, theme, Counter, Count, Inline} from '../_common'

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
const [alter, reset] = createActions([
  'alter',
  'reset'
])
const regularAction = 'action::stringForm'

/**
 * Update functions
 */
const onAlter = (state, event) => ({
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
  [alter.is, onAlter],
  [reset.is, onReset],
  [isType(regularAction), onRegularAction]
])

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = type => event => signal.emit({type})

const CountWidget = ({count}) => (
  <Counter>
    <Count>{count}</Count>
    <Inline>
      <Button
        onClick={event => alter.of(1)}
      >+</Button>
      <Button
        onClick={event => alter.of(-1)}
      >-</Button>
      <Button
        onClick={event => reset.of()}
        background={theme.color.secondary}
      >Reset</Button>
      <Button
        onClick={dispatch(regularAction)}
        background={theme.color.secondary}
      >String Event</Button>
    </Inline>
  </Counter>
)

/**
 * The signal observer notifies when the application state changes
 */
signal.observe(state => {
  render(
    <App state={state}>
      <CountWidget count={state.count} />
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
