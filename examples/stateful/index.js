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

window.state = state

const styles = {}

var id = 0

/**
 * Counter
 */
styles.counter = {
  fontSize: 34,
  fontWeight: 300,
  lineHeight: 2,
  margin: '3px 0'
}

class Counter extends Component {
  static style = {
    counter: {
      border: '1px solid rgb( 232, 232, 232)',
      borderRadius: 6,
      overflow: 'hidden'
    },
    header: {
      background: 'rgb( 235, 137, 49 )',
      fontSize: 13,
      color: 'rgb( 255, 255, 255 )',
      fontWeight: 600,
      textTransform: 'uppercase',
      padding: '3px 12px'
    },
    container: {
      display: 'flex'
    },
    left: {
      flex: .5,
      padding: 12,
      background: 'rgb( 255, 255, 255 )'
    },
    right: {
      flex: .5,
      background: 'rgb( 40, 40, 40 )',
      color: 'rgb( 244, 246, 252 )',
      padding: 12
    },
    codeHeader: {
      fontSize: 17,
      marginTop: 0,
      marginBottom: 12
    },
    code: {
      fontFamily: 'Source Code Pro, consolas, monospace',
      fontSize: 15,
      margin: 0
    },
    count: {
      fontSize: 44,
      textAlign: 'center',
      display: 'block',
      marginBottom: 12
    }
  };

  constructor( props ) {
    super( props )

    // ids should be unique, for brevity just increment a global to ensure uniqueness
    this.id = id++ + ''

    // Create a new root for this component and reference to it
    let next = this.props.root.update( cursor => {
      return cursor.merge({
        [ this.id ]: {
          count: 0
        }
      })
    })
    this.state = next.cursor( this.id )

  }

  componentWillUnmount() {
    this.props.root.update( cursor => {
      return cursor.delete( this.id )
    })
  }

  componentWillReceiveProps( next ) {
    this.state = next.root.cursor( this.id )
  }

  onAdd = event => {
    this.state.cursor( 'count' ).update( cursor => ++cursor )
  };

  onSubtract = event => {
    this.state.cursor( 'count' ).update( cursor => --cursor )
  };

  render() {
    return (
      <div style={ Counter.style.counter }>
        <header style={ Counter.style.header }>
          <span>Counter { this.id }</span>
        </header>

        <div style={ Counter.style.container }>
          <div style={ Counter.style.left }>
            <span style={ Counter.style.count }>{ this.state.get( 'count' ) }</span>
            <ActionButton onClick={ this.onAdd }>+</ActionButton>
            <ActionButton onClick={ this.onSubtract }>-</ActionButton>
          </div>

          <div style={ Counter.style.right }>
            <p style={ Counter.style.codeHeader }><code>Counter</code> component state</p>
            <pre style={ Counter.style.code }>
              { JSON.stringify( this.state.toJSON(), null, '  ' ) }
            </pre>
          </div>
        </div>
      </div>
    )
  }
}

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
          <Counter root={ this.props.state } />
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
  console.log( 'render' )
  ReactDOM.render( <App state={ state.cursor( 'root' ) } />, element )
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
