
/**
 * The architecture is highly similar to the [Elm Architecture](https://github.com/evancz/elm-architecture-tutorial).
 * ---
 * Model -> Action -> Update -> View
 * Components are defined by their model, which represents their state. This model
 * is plugged into the main state object and referenced via cursors.
 * Presentational components request actions, which are fulfilled by update
 * components. Requests are handled via a Signal, which can optionally populate
 * the response with the model is relates to. The update function acts as a sink
 * and performs the mutations, whereby the app re-renders.
 * Components grab their state directly from the model, but as the model becomes
 * a part of the state tree everything is connected.
 */

import React from 'react'
import { Signal } from '../../lib'
import Immutable from 'immutable'
import { Observable } from 'rx-lite'
import state from './state'
import ActionButton from '../_common/actionButton'


/**
 * Actions enum
 */
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
