/**
 * Example using component ids to load from a fresh state tree
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Enhance } from '../../lib'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import User from './user'
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
 * App component
 */
styles.app = {
  container: {
    display: 'flex'
  },
  left: {
    flex: .5,
    boxSizing: 'border-box',
    padding: '1em'
  },
  right: {
    flex: .5,
    boxSizing: 'border-box',
    minHeight: '100vh',
    borderLeft: '1px solid rgb( 232, 232, 232)',
    background: 'rgb( 40, 40, 40 )',
    padding: '1em',
    overflow: 'scroll'
  },
  btn: {
    background: 'rgb( 235, 137, 49 )'
  }
}

const onLoad = () => {
  state.load( localStorage.state )
}

const onSave = () => {
  localStorage.state = state.save()
}

const App = props => {
  return (
    <div style={ styles.app.container }>
      <div style={ styles.app.left }>
        <ActionButton
          styles={ styles.app.btn }
          onClick={ onLoad }
        >Load</ActionButton>
        <ActionButton
          styles={ styles.app.btn }
          onClick={ onSave }
        >Save</ActionButton>
        <p>Uses the unique ID passed to it to gain persistence</p>
        <p>Example saves the state tree into local storage, by using unique reproducible ids for components they can survive a page refresh and load</p>
        <User id={ 'uniqueID' } />
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
  ReactDOM.render( <App state={ state.reference( 'root' ) } />, element )
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
