/**
 * Multi store example
 * ---
 * Adds another action stream that creates and destroys stateful components.
 * Decouples business logic from presentational logic using dispatchers and
 * action functions
 */

import React from 'react'
import ReactDOM from 'react-dom'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import state from './state'
import { ACTIONS } from './actions'

const styles = {}

/**
 * Counter
 */
styles.counter = {
  fontSize: 34,
  lineHeight: 2,
  margin: '3px 0'
}

const Counter = props => {
  return (
    <div>
      <h1 style={ styles.counter }>Count <span>{ props.count }</span></h1>
      <ActionButton onClick={ event => {
        state.dispatch({
          type: ACTIONS.ADD,
          id: props.id
        })
      }}>+</ActionButton>
      <ActionButton onClick={ event => {
        state.dispatch({
          type: ACTIONS.SUBTRACT,
          id: props.id
        })
      }}>-</ActionButton>
    </div>
  )
}


/**
 * Routes state through to children explicitly
 */
const App = props => {
  let counters = props.state.get( 'counters' )
    .map( counter => {
      const {
        id,
        count
      } = counter.toJS()

      return <Counter key={ id } { ...{ id, count } } />
    })

  return (
    <div>
      { counters }
    </div>
  )
}


/**
 * Main app render function
 */
function render( appstate ) {
  ReactDOM.render( <App state={ appstate.get( 'app' ) } />, element )
}

/**
 * Attach listener to re-render on state changes and start the state machine
 */
state
  .on( 'update', render )
  .start()
