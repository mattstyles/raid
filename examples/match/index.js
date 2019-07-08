/**
 * Basic counter example using match to select an update to run
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action types
 */

import { render } from 'react-dom'
import { Signal } from 'raid'
import { match, debug } from 'raid-addons'

import { App, Button, element, theme, Counter, Count, Inline } from '../_common'

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
  'alter': 'actions:alter',
  'reset': 'actions:reset'
}

/**
 * Update functions
 */
const onAlter = (state, { payload }) => ({
  ...state,
  count: state.count + payload
})

const onReset = (state) => ({
  ...state,
  count: 0
})

const isType = type => event => type === event.type
const update = match([
  [isType(actions.alter), onAlter],
  [isType(actions.reset), onReset]
])

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = (type, payload) => domEvent => signal.emit({ type, payload })

const CountWidget = ({ count }) => (
  <Counter>
    <Count>{count}</Count>
    <Inline>
      <Button
        onClick={dispatch(actions.alter, 1)}
      >+</Button>
      <Button
        onClick={dispatch(actions.alter, -1)}
      >-</Button>
      <Button
        onClick={dispatch(actions.reset)}
        background={theme.color.secondary}
      >Reset</Button>
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
signal.register(update)
signal.register(debug('::'))
