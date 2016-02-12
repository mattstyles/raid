
import defined from 'defined'
import React, { Component } from 'react'
import CONSTANTS from './constants'


const Enhance = function( state, initialState = {} ) {

  // Check that state has been passed and try to assert that it is a reference cursor
  if ( !state || ( !state.cursor && !state.destroy ) ) {
    throw new Error( 'Incorrect or missing state passed to Raid::Enhancer' )
  }

  return ( Composed, componentState = initialState ) => {

    // It makes no sense to pass a stateless component to an enhancer designed
    // to add state, but someone will do it at some point, probably me.
    if ( !Composed.render && !Composed.prototype.render ) {
      console.warn( 'Stateless component passed to Raid enhancer', 'https://goo.gl/koXJTa' )
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

        if ( Composed.State ) {
          componentState = Composed.State
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
        //return <Composed { ...this.props } state={ this.currentState } />
        return super.render()
      }
    }
  }
}

export default Enhance
