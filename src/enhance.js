
import React, { Component } from 'react'
import CONSTANTS from './constants'


var Enhance = function( state, initialState = {} ) {
  if ( !state ) {
    throw new Error( 'no state object passed to the enhancer' )
  }

  return ( Composed, componentState = initialState ) => {

    return class extends Component {
      constructor( props ) {
        super( props )

        // @TODO handle stateless case
        // @TODO check that the state container passed in is a reference cursor

        let root = state.reference( CONSTANTS.COMPONENTS )

        // Create a random string for this component and append to state tree
        this.id = Math.random().toString(36).substring(2)
        root.cursor().update( cursor => {
          return cursor.merge({
            [ this.id ]: componentState
          })
        })

        // Grab a reference to the new data
        this.state = root.reference( this.id )
      }

      componentWillUnmount() {
        this.state.destroy()
        state.reference[ CONSTANTS.COMPONENT ].update( cursor => {
          return cursor.delete( this.id )
        })
      }

      render() {
        let freshState = this.state.cursor()
        return <Composed { ...this.props } state={ freshState } />
      }
    }
  }
}

export default Enhance
