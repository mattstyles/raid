/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import React from 'react'
import ReactDOM from 'react-dom'

import Immreact from '../../lib'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import initialState from './initialState'



const styles = {}



/**
 * Counter
 */
styles.counter = {
  fontSize: 34,
  fontWeight: 300,
  lineHeight: 2,
  margin: '3px 0'
}
const Counter = props => <h1 style={ styles.counter }>Count <span>{ props.count }</span></h1>


/**
 * Explicitly mutate state
 */
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

const Controls = props => {
  return (
    <div>
      <ActionButton onClick={ add( props.count ) }>+</ActionButton>
      <ActionButton onClick={ subtract( props.count ) }>-</ActionButton>
    </div>
  )
}


/**
 * Routes state through to children explicitly
 */
const App = props => {
  return (
    <div>
      <Counter count={ props.state.get( 'count' ) } />
      <Controls count={ props.state.cursor( 'count' ) } />
    </div>
  )
}


/**
 * State object
 */
const state = new Immreact.State( 'app', initialState )


/**
 * Main app render function
 */
function render() {
  ReactDOM.render( <App state={ state.cursor( 'app' ) } />, element )
}

/**
 * Attach listener to re-render on state changes
 */
state.on( 'update', render )


/**
 * Go!
 */
render()
