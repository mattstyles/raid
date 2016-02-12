
/**
 * Example of using the enhancer to add internal connected state to a component
 * without the use of global state object
 */

import React, { Component } from 'react'
import { Record } from 'immutable'
import { Enhance } from '../../src'

import ActionButton from '../_common/actionButton'

/**
 * Enhanced class
 * ---
 * Initial state can either be wired into the enhancer, applied as a parameter to
 * the enhancer function or as a static field on the component class
 */
// Create a record to describe the class initial state
const CounterRecord = new Record({
  count: 0
})

// The enhancer can work without the state tree being explicitly passed to it,
// although this class will expect the root to be passed as a prop
export default Enhance( class extends Component {
  static State = new CounterRecord();

  constructor( props ) {
    super( props )
  }

  onAdd = event => {
    this.state.cursor( 'count' ).update( cursor => ++cursor )
  };

  onSubtract = event => {
    this.state.cursor( 'count' ).update( cursor => --cursor )
  };

  render() {
    return (
      <div>
        <h1>Counter { this.state.get( 'count' ) }</h1>
        <ActionButton onClick={ this.onAdd }>+</ActionButton>
        <ActionButton onClick={ this.onSubtract }>-</ActionButton>
      </div>
    )
  }
})
