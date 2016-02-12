/**
 * Example using the component enhancer function to wrap components
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import state from './state'

import Counter from './counter'

const styles = {}

/**
 * Render the state tree to the dom
 */
styles.code = {
  fontFamily: 'Source Code Pro, consolas, monospace',
  fontSize: 15,
  color: 'rgb( 244, 246, 252 )',
  margin: 0
}
const RenderState = props => {
  return (
    <pre style={ styles.code }>
      { JSON.stringify( state.get().toJSON(), null, '  ' ) }
    </pre>
  )
}


/**
 * App component
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
  }
}

const App = props => {
  return (
    <div style={ styles.app.container }>
      <div style={ styles.app.left }>
        <p>This component has been passed a root to attach to</p>
        <Counter root={ props.appState } id={ 'counterKey2' } />
      </div>
      <div style={ styles.app.right }>
        <RenderState />
      </div>
    </div>
  )
}


/**
 * Main app render function
 */
function render() {
  ReactDOM.render( <App appState={ state.reference( 'root' ) } />, element )
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
