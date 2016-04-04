
import React from 'react'
import Immutable from 'immutable'
import state from './state'
import signal from './signal'
import ActionButton from '../_common/actionButton'

const ACTIONS = {
  ADD: 'action:add',
  SUBTRACT: 'action:subtract'
}

/**
 * Model
 */
const Model = new Immutable.Record({
  value: 0
})

export const model = state
  .create( 'counter', new Model() )


/**
 * Update
 */
const release = signal.register( source => {
  const add = source
    .filter( event => event.type === ACTIONS.ADD )
    .subscribe( event => {
      model.cursor( 'value' ).update( val => ++val )
    })

  const subtract = source
    .filter( event => event.type === ACTIONS.SUBTRACT )
    .subscribe( event => {
      model.cursor( 'value' ).update( val => --val )
    })

  return function dispose() {
    add.dispose()
    subtract.dispose()
  }
})


/**
 * View
 */
const styles = {}

styles.counter = {
  background: 'rgb( 255, 255, 255 )',
  border: '1px solid rgb( 232, 232, 232 )',
  borderRadius: 3,
  padding: '1em 2em',
  marginTop: 12,
  marginBottom: 12
}
styles.counterText = {
  fontSize: 34,
  fontWeight: 300,
  lineHeight: 1,
  margin: '3px 0 12px'
}

export const Counter = props => {
  return (
    <div style={ styles.counter }>
      <h1 style={ styles.counterText }>Count <span>{ model.cursor().get( 'value' ) }</span></h1>
      <ActionButton onClick={ event => {
        signal.dispatch({
          type: ACTIONS.ADD
        })
      }}>+</ActionButton>
      <ActionButton onClick={ event => {
        signal.dispatch({
          type: ACTIONS.SUBTRACT
        })
      }}>-</ActionButton>
    </div>
  )
}
