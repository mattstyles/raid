/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import {render} from 'inferno-dom'

import {Signal} from 'raid/src'

import element from '../_common/element'
import Button from '../_common/actionButton'
import {View, Main, Code} from '../_common/layout'

/**
 * The main signal can be observed for changes to application state.
 * The signal accepts a parameter which defines the initial state.
 */
const signal = new Signal({
  count: 0
})

/**
 * Action enum gives the updates a key to perform mutations
 */
const ACTIONS = {
  ADD: 'actions:add',
  SUBTRACT: 'actions:subtract'
}

/**
 * updates are responsible for mutating state and returning it.
 * They can be composed to provide more complex state manipulation.
 */
const update = (state, event) => {
  if (event.type === ACTIONS.ADD) {
    state.count += 1
    return state
  }

  if (event.type === ACTIONS.SUBTRACT) {
    state.count -= 1
    return state
  }

  return state
}

/**
 * Raid can be used with any view library
 */
const styles = {
  counter: {
    display: 'inline-block',
    padding: '8px 0px 8px 8px',
    background: 'rgb(255, 255, 255)',
    border: '1px solid rgb(230,232,238)',
    borderRadius: '3px'
  },
  count: {
    display: 'inline-block',
    fontSize: '28px',
    margin: '0px 16px 0px 8px',
    verticalAlign: 'middle'
  },
  counterControls: {
    display: 'inline-block'
  }
}

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = type => {
  return event => {
    signal.emit({type})
  }
}

const Counter = ({count}) => {
  return (
    <div style={styles.counter}>
      <span style={styles.count}>{count}</span>
      <div style={styles.counterControls}>
        <Button
          onClick={dispatch(ACTIONS.ADD)}
        >+</Button>
        <Button
          onClick={dispatch(ACTIONS.SUBTRACT)}
        >-</Button>
      </div>
    </div>
  )
}

const App = ({state}) => {
  return (
    <View>
      <Main>
        <Counter count={state.count} />
      </Main>
      <Code>
        <pre>{JSON.stringify(state, null, '  ')}</pre>
      </Code>
    </View>
  )
}

/**
 * The signal observer notifies when the application state changes
 */
signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
})

/**
 * Register updates.
 * Returns a dispose function which can be used to destroy an update function.
 */
signal.register(update)
