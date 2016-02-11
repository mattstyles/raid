
import defined from 'defined'
import React, { Component } from 'react'
import CONSTANTS from './constants'


const Enhance = function( state, initialState = {} ) {
  if ( !state ) {
    throw new Error( 'no state object passed to the enhancer' )
  }

  return ( Composed, componentState = initialState ) => {

    return class extends Component {
      constructor( props ) {
        super( props )

        if ( Composed.State ) {
          componentState = Composed.State
        }

        // @TODO handle stateless case
        // @TODO check that the state container passed in is a reference cursor

        let root = this.props.root || state.reference( CONSTANTS.COMPONENTS )

        // Create a random string for this component and append to state tree
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
        this.state = root.reference( this.id )
        this.currentState = this.state.cursor()
      }

      componentDidMount() {
        console.log( 'enhancer mounted' )
      }

      // @TODO hasslefree perf gains for components
      shouldComponentUpdate( next ) {
        //Composed.shouldComponentUpdate()
        let nextState = this.state.cursor()
        // console.log( 'state', this.currentState.toJS(), nextState.toJS() )
        // console.log( 'next props enhancer', this.props.data.toJS(), next.data.toJS() )

        console.log( 'hoc shouldUpdate' )

        // @TODO needs to also query component props, but how to grab from
        // update function from Composed?
        // return !this.currentState.equals( nextState )
        return true
      }

      componentWillUnmount() {
        this.state.destroy()

        let root = this.props.root || state.reference( CONSTANTS.COMPONENTS )

        root.cursor().update( cursor => {
          return cursor.delete( this.id )
        })
      }

      render() {
        this.currentState = this.state.cursor()
        return <Composed { ...this.props } state={ this.currentState } />
      }
    }
  }
}

export default Enhance
