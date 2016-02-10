/**
 * Example using the component enhancer function to wrap components
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import { Enhance } from '../../lib'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import ColorBlock from './colorblock'
import state from './state'



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
 * Enhanced class
 * ---
 * Initial state can either be wired into the enhancer, applied as a parameter to
 * the enhancer function or as a static field on the component class
 */
// Create a record to describe the class initial state
const Record = new Immutable.Record({
  count: 0
})

// create an enhancer and wire in the initial state
const Enhancer = Enhance( state, new Record() )

// Now enhance the component
const Counter = Enhancer( class extends Component {
  // static State = new Record();

  constructor( props ) {
    super( props )
  }

  onAdd = event => {
    this.props.state.cursor( 'count' ).update( cursor => ++cursor )
  };

  onSubtract = event => {
    this.props.state.cursor( 'count' ).update( cursor => --cursor )
  };

  render() {
    return (
      <div>
        <h1>Counter { this.props.state.get( 'count' ) }</h1>
        <ActionButton onClick={ this.onAdd }>+</ActionButton>
        <ActionButton onClick={ this.onSubtract }>-</ActionButton>
      </div>
    )
  }
})

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
        <p>This component attaches to the reserved components root</p>
        <Counter />
        <hr></hr>
        <p>This component has been passed a root to attach to</p>
        <Counter root={ props.state } />
      </div>
      <div style={ styles.app.right }>
        <RenderState />
      </div>
      <ColorBlock />
    </div>
  )
}


/**
 * Main app render function
 */
function render() {
  ReactDOM.render( <App state={ state.reference( 'root' ) } />, element )
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
