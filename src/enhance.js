
import defined from 'defined'
import React, { Component } from 'react'
import CONSTANTS from './constants'


/**
 * Enhancer thunk
 * Caches the state and, optionally, the initial state for this component
 * @param state <Raid::State|Component> accepts either a state tree reference cursor
 *   or a component to enhance
 * @param initialState _optional_ the initial state this component will be created with
 */
const Enhance = function( state, initialState = {} ) {

  /**
   * The actual Enhancer
   * Takes a component class and enhances it with an internal state
   * @param Composed <class|constructor> takes a constructor function and enhances
   *   it with internal state
   * @param componentState _optional_ initial state can be added here, alternatively
   *   it can be supplied as a static class prop
   */
  const Enhancer = ( Composed, componentState = initialState ) => {

    // It makes no sense to pass a stateless component to an enhancer designed
    // to add state, but someone will do it at some point, probably me.
    if ( !Composed.render && !Composed.prototype.render ) {
      console.warn( 'Stateless component passed to Raid enhancer', 'https://goo.gl/ZO2F56' )
      return Composed
    }

    /**
     * This originally was a true HOC, but we need lifecycle methods so going
     * with extension, is there a better way to gain lifecycle?
     */
    return class extends Composed {
      static displayName = Composed.displayName || Composed.name || 'RaidEnhancer';
      static _isRaidEnhanced = true;

      constructor( props ) {
        super( props )

        // Look for state as a static class property
        if ( Composed.State ) {
          componentState = Composed.State
        }

        // Grab the root, if state is not a reference cursor then it should be
        // passed as a prop, otherwise we have nowhere in the state tree to
        // attach our state
        if ( state._isAwaitingRoot && !this.props.root ) {
          throw new Error( 'Raid enhanced components require a root to attach to' )
        }

        let root = this.props.root || state.reference( CONSTANTS.COMPONENTS )

        // Create a random string for this component and append to state tree
        // unless id is explicitly passed
        this.id = defined(
          props.id,
          componentState.id,
          ( performance.now() * Math.random() ).toString( 36 ).match(/\.(.*)$/ )[1]
        )
        root.cursor().update( cursor => {
          return cursor.merge({
            [ this.id ]: componentState
          })
        })

        // Grab a reference to the new data
        this._root = root.reference( this.id )
        this.state = this._root.cursor()
      }

      shouldComponentUpdate( next ) {
        // Assume a change if no update function is supplied
        if ( !super.shouldComponentUpdate ) {
          return true
        }

        let nextState = this._root.cursor()

        // Uses the composed class's function to test prop equality and also
        // checks its own state equality i.e. a change in either props or
        // state will trigger and update, otherwise it can be skipped. We can
        // not check for props explicitly here as we do not know the structure.
        return !this.state.equals( nextState ) || super.shouldComponentUpdate( next )
      }

      componentWillUnmount() {
        this._root.destroy()

        let root = this.props.root || state.reference( CONSTANTS.COMPONENTS )

        root.cursor().update( cursor => {
          return cursor.delete( this.id )
        })
      }

      render() {
        this.state = this._root.cursor()
        //return <Composed { ...this.props } state={ this.state } />
        return super.render()
      }
    }
  }

  // If a component was passed directly then continue, expecting a root to be
  // passed to it later as a prop
  if ( typeof state === 'function' ) {
    state._isAwaitingRoot = true
    return Enhancer( state )
  }

  // Check that state has been passed and try to assert that it is a reference cursor
  if ( !state || ( !state.cursor && !state.destroy ) ) {
    throw new Error( 'Incorrect or missing state passed to Raid::Enhancer' )
  }

  return Enhancer

}

export default Enhance
