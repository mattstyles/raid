
import React from 'react'
import { Signal } from '../../lib'
import Immutable from 'immutable'
import { Observable } from 'rx-lite'
import state from './state'
// import signal from './signal'
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
 * Signal
 */
const signal = new Signal({
  model: model,
  key: 'value'
})


/**
 * Update
 */
const release = signal.register( source => {
  const add = source
    .filter( event => event.type === ACTIONS.ADD )
    .map( event => () => event.model.update( c => ++c ) )

  const subtract = source
    .filter( event => event.type === ACTIONS.SUBTRACT )
    .map( event => () => event.model.update( c => --c ) )

  return Observable.merge([ add, subtract ])
    .subscribe( action => action() )
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
  let data = model.cursor()

  return (
    <div style={ styles.counter }>
      <h1 style={ styles.counterText }>Count <span>{ data.get( 'value' ) }</span></h1>
      <ActionButton onClick={ event => {
        signal.dispatch( ACTIONS.ADD )
      }}>+</ActionButton>
      <ActionButton onClick={ event => {
        signal.dispatch( ACTIONS.SUBTRACT )
      }}>-</ActionButton>
    </div>
  )
}
