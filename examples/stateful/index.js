/**
 * Stateful components
 * ---
 * The Counter components create their own internal state when they are created.
 * They must be passed a reference to their root from which they can grab fresh
 * cursors when necessary, this keeps everything synced correctly. They then
 * create their own state containers and keep a reference to it, and are able
 * to delete themselves when they unmount.
 *
 * The App component here simply keeps track of how many counters are currently
 * active. In the real world an example such as this would probably just pass
 * props to each counter, but, more complex examples might then add internal
 * state to components.
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import state from './state'

const styles = {}

var id = 0

/**
 * Counter
 */

class Counter extends Component {
  static style = {
    counter: {
      border: '1px solid rgb( 232, 232, 232)',
      borderRadius: 6,
      overflow: 'hidden',
      marginBottom: 12
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

    // Create a new root for this component
    this.props.root.cursor().update( cursor => {
      return cursor.merge({
        [ this.id ]: {
          count: 0
        }
      })
    })

    // Grab a reference to the new data
    this.state = this.props.root.reference( this.id )
  }

  componentWillUnmount() {
    this.state.destroy()
    this.props.root.cursor().update( cursor => {
      return cursor.delete( this.id )
    })
  }

  onAdd = event => {
    this.state.cursor( 'count' ).update( cursor => ++cursor )
  };

  onSubtract = event => {
    this.state.cursor( 'count' ).update( cursor => --cursor )
  };

  render() {
    // Grab a fresh cursor from the reference
    let state = this.state.cursor()

    return (
      <div style={ Counter.style.counter }>
        <header style={ Counter.style.header }>
          <span>Counter { this.id }</span>
        </header>

        <div style={ Counter.style.container }>
          <div style={ Counter.style.left }>
            <span style={ Counter.style.count }>{ state.get( 'count' ) }</span>
            <ActionButton onClick={ this.onAdd }>+</ActionButton>
            <ActionButton onClick={ this.onSubtract }>-</ActionButton>
          </div>

          <div style={ Counter.style.right }>
            <p style={ Counter.style.codeHeader }><code>Counter</code> component state</p>
            <pre style={ Counter.style.code }>
              { JSON.stringify( state.toJSON(), null, '  ' ) }
            </pre>
          </div>
        </div>
      </div>
    )
  }
}

class App extends Component {
  static style = {
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
    },
    controls: {
      marginBottom: '1em'
    }
  };

  constructor( props ) {
    super( props )
  }

  addCounter = event => {
    this.props.state.cursor( 'counters' ).update( cursor => ++cursor )
  };

  removeCounter = event => {
    this.props.state.cursor( 'counters' ).update( cursor => --cursor )
  };

  addMultiple = event => {
    this.props.state.cursor( 'counters' ).update( cursor => cursor += 3 )
  };

  render() {
    let counters = []
    for ( let i = 0; i < this.props.state.cursor( 'counters' ).deref(); i++ ) {
      counters.push( <Counter key={ 'counter' + i } root={ this.props.state } /> )
    }

    return (
      <div style={ App.style.container }>
        <div style={ App.style.left }>
          <div style={ App.style.controls }>
            <ActionButton onClick={ this.addCounter }>Add</ActionButton>
            <ActionButton onClick={ this.addMultiple }>Add Multiple</ActionButton>
            <ActionButton onClick={ this.removeCounter }>Remove</ActionButton>
          </div>
          { counters }
        </div>
        <div style={ App.style.right }>
          <pre style={ App.style.code }>
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
  ReactDOM.render( <App state={ state.reference( 'root' ) } />, element )
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
