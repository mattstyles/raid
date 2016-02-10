/**
 * Multi store example
 * ---
 * Adds another action stream that creates and destroys stateful components.
 * Decouples business logic from presentational logic using dispatchers and
 * action functions.
 *
 * Presentational logic accesses the state tree in a read-only fashion by
 * using state.get
 * Business logic needs to be able to update cursors and so accesses the
 * data by using state.cursor
 */

import React from 'react'
import ReactDOM from 'react-dom'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import state from './state'
import { ACTIONS } from './actions'
import { APP_ACTIONS } from './appActions'

const styles = {}

/**
 * Counter
 */
styles.counter = {
  background: 'rgb( 255, 255, 255 )',
  border: '1px solid rgb( 232, 232, 232 )',
  borderRadius: 3,
  padding: '1em 2em',
  marginTop: 12,
  marginBottom: 12
}
styles.counterText = {
  fontSize: 34,
  fontWeight: 300,
  lineHeight: 1,
  margin: '3px 0 12px'
}


const Counter = props => {
  return (
    <div style={ styles.counter }>
      <h1 style={ styles.counterText }>Count <span>{ props.count }</span></h1>
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
styles.app = {
  container: {
    display: 'flex'
  },
  left: {
    flex: .5,
    padding: '1em'
  },
  right: {
    flex: .5,
    minHeight: '100vh',
    borderLeft: '1px solid rgb( 232, 232, 232)',
    background: 'rgb( 40, 40, 40 )',
    padding: '1em'
  },
  controls: {
    marginBottom: '1em'
  },
  code: {
    fontFamily: 'Source Code Pro, consolas, monospace',
    fontSize: 15,
    color: 'rgb( 244, 246, 252 )',
    margin: 0
  }
}

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
    <div style={ styles.app.container} >
      <div style={ styles.app.left }>
        <div style={ styles.app.controls }>
          <ActionButton
            background={ 'rgb( 235, 137, 49 )' }
            onClick={ event => {
              state.dispatch({
                type: APP_ACTIONS.ADD
              })
            }}
          >Add</ActionButton>
          <ActionButton
            background={ 'rgb( 235, 137, 49 )' }
            onClick={ event => {
              state.dispatch({
                type: APP_ACTIONS.REMOVE
              })
            }}
          >Remove</ActionButton>
        </div>
        { counters }
      </div>
      <div style={ styles.app.right }>
        <pre style={ styles.app.code }>
          { JSON.stringify( state.get().toJSON(), null, '  ' ) }
        </pre>
      </div>
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