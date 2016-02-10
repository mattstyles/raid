/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import state from './state'



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
  code: {
    fontFamily: 'Source Code Pro, consolas, monospace',
    fontSize: 15,
    color: 'rgb( 244, 246, 252 )',
    margin: 0
  }
}
class App extends Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return (
      <div style={ styles.app.container }>
        <div style={ styles.app.left }>

        </div>
        <div style={ styles.app.right }>
          <pre style={ styles.app.code }>
            { JSON.stringify( state.get().toJSON(), null, '  ' ) }
          </pre>
        </div>
      </div>
    )
  }
}


/**
 * Main app render function
 */
function render() {
  ReactDOM.render( <App state={ state.cursor( 'app' ) } />, element )
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
