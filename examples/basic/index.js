/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import {render} from 'inferno-dom'

import {Signal} from '../../lib'

import element from '../_common/element'
import Button from '../_common/actionButton'
import {View, Main, Code} from '../_common/layout'

const signal = new Signal({
  count: 0
})

const ACTIONS = {
  ADD: 'actions:add',
  SUBTRACT: 'actions:subtract'
}

const reducer = (state, event) => {
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

const Counter = ({count}) => {
  return (
    <div style={styles.counter}>
      <span style={styles.count}>{count}</span>
      <div style={styles.counterControls}>
        <Button
          onClick={e => {
            signal.emit({type: ACTIONS.ADD})
          }}
        >+</Button>
        <Button
          onClick={e => {
            signal.emit({type: ACTIONS.SUBTRACT})
          }}
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

signal.subscribe(state => {
  render(
    <App state={state} />,
    element
  )
})

signal.register(reducer)
