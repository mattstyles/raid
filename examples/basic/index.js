/**
 * Basic counter example
 */

import React from 'react'
import ReactDOM from 'react-dom'

import Immreact from '../../lib'

import initialState from './initialState'

var el = document.createElement( 'div' )
Object.assign( el.style, {
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  webkitFontSmoothing: 'antialiased',
  color: 'rgb( 64, 64, 64 )',
  padding: '24px'
})
document.body.appendChild( el )

var state = new Immreact.State( 'app', initialState )

const styles = {}

/**
 * Counter
 */
styles.counter = {
  fontSize: 34,
  lineHeight: 2
}
const Counter = props => <h1 style={ styles.counter }>Count <span>{ props.count }</span></h1>


/**
 * Attach actions to alter State
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
      <button onClick={ add( props.count ) }>Add</button>
      <button onClick={ subtract( props.count ) }>Subtract</button>
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
 * Main app render function
 */
function render() {
  ReactDOM.render( <App state={ state.cursor( 'app' ) } />, el )
}

/**
 * Attach listener to re-render on state changes
 */
state.on( 'update', render )


/**
 * Go!
 */
render()
