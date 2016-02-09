/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

var el = document.createElement( 'div' )
Object.assign( el.style, {
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  webkitFontSmoothing: 'antialiased',
  color: 'rgb( 64, 64, 64 )',
  padding: '24px'
})
document.body.appendChild( el )



import React from 'react'
import ReactDOM from 'react-dom'

import Immreact from '../../lib'

import ActionButton from '../_common/actionButton'
import state from './state'

const styles = {}

const ACTIONS = {
  ADD: 'actions:add',
  SUBTRACT: 'actions:subtract'
}

state.register( dispatch => {
  if ( dispatch.type === ACTIONS.ADD ) {
    let counters = state.get([ 'app', 'counters' ])
    let counterIndex = counters.findIndex( count => count.get( 'id' ) === dispatch.id )
    let counter = counters.get( counterIndex )

    counters.update( cursor => {
      let count = counter.get( 'count' )
      return [
        Object.assign( counter, {
          count: ++count
        })
      ]
    })

    return
  }

  if ( dispatch.type === ACTIONS.SUBTRACT ) {
    console.log( 'subtracting' )
    return
  }

  return
})

/**
 * Counter
 */
styles.counter = {
  fontSize: 34,
  lineHeight: 2,
  margin: '3px 0'
}

const add = count => {
  return () => {
    count.update( cursor => ++cursor )
  }
}
const subtract = count => {
  return () => {
    count.update( cursor => --cursor )
  }
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
  let counters = props.state.get( 'counters' ).map( counter => {
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
  ReactDOM.render( <App state={ appstate.cursor( 'app' ) } />, el )
}

/**
 * Attach listener to re-render on state changes and start the state machine
 */
state
  .on( 'update', render )
  .start()
