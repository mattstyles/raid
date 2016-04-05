
import immstruct from 'immstruct'
import Immutable from 'immutable'
import EventEmitter from 'eventemitter3'

import CONSTANTS from './constants'

const _state = Symbol( 'state' )

/**
 * @class
 * Holds data representing the current state of the application
 */
export default class State extends EventEmitter {

  /**
   * @constructs
   * A default namespace can be passed in here
   * @param key <String> if key is not a string it will be interpreted as initial state
   * @param initialState <Object> _optional_ defaults to {}
   */
  constructor( key, initialState = {} ) {
    super()

    if ( typeof key !== 'string' ) {
      initialState = key
      key = CONSTANTS.ROOT
    }

    // Private state immstruct structure
    this[ _state ] = new immstruct.Immstruct().get( key, {
      [ CONSTANTS.COMPONENTS ]: {}
    })

    this.create( key, initialState )

    // Use animation frame so that quick mutations to the tree are batched
    // this[ _state ].on( 'swap', this.onSwap )
    this[ _state ].on( 'next-animation-frame', this.onSwap )
  }

  /**
   * For now just triggered an update to call the listener
   */
  start() {
    this.onUpdate()
  }

  /**
   * update function passed back the state tree
   */
  onUpdate() {
    this.emit( 'update', this )
  }

  /**
   * Check for a change and emit an update when one occurs
   */
  onSwap = ( o, n, k ) => {
    if ( !o ) {
      this.onUpdate()
      return
    }

    // New components will register themselves into components so make that silent
    if ( k.length === 1 && k[ 0 ] === CONSTANTS.COMPONENTS ) {
      return
    }

    if ( o && n ) {
      // Check that a change really did happen
      if ( !Immutable.is( o.getIn( k ), n.getIn( k ) ) ) {
        this.onUpdate()
      }
    }
  };

  /**
   * Creates a new root level immutable and returns a ref to it
   * @param key <String> _required_
   * @param value <Object> _optional_ defaults to {}
   */
  create( key, value = {} ) {
    if ( !key ) {
      throw new Error( 'No key specified when creating new state root' )
    }

    if ( typeof key !== 'string' ) {
      throw new Error( 'No key specified when creating new state root' )
    }

    // @TODO should check if key already exists

    this[ _state ].cursor().update( cursor => {
      return cursor.merge({
        [ key ]: value
      })
    })

    return this[ _state ].reference( key )
  }

  /**
   * Grabs a fresh cursor to the data structure
   * @param args <Array>|<String> specify structure keyPath to grab
   */
  cursor( args ) {
    if ( !args ) {
      return this[ _state ].cursor()
    }

    if ( typeof args === 'string' ) {
      return this[ _state ].cursor( args )
    }

    return this[ _state ].cursor([ ...args ])
  }

  /**
   * Returns the dereferenced value for read-only access
   * @param args <Array>|<String> specify structure keyPath to grab
   */
  get( args ) {
    if ( !args ) {
      return this[ _state ].cursor().deref()
    }

    if ( typeof args === 'string' ) {
      return this[ _state ].cursor( args ).deref()
    }

    return this[ _state ].cursor([ ...args ]).deref()
  }

  /**
   * Returns a reference to a value. Can be used to access fresh cursors or as
   * its own root.
   * @param args <Array>|<String> specify structure keyPath to grab
   */
  reference( args ) {
    if ( !args ) {
      return this[ _state ].reference()
    }

    if ( typeof args === 'string' ) {
      return this[ _state ].reference( args )
    }

    return this[ _state ].reference([ ...args ])
  }


  /**
   * Returns a JSON string to save
   */
  save() {
    try {
      return JSON.stringify( this[ _state ].cursor().toJSON() )
    } catch( err ) {
      throw new Error( err )
    }
  }

  /**
   * Loads a JSON string into the current state
   */
  load( state ) {
    try {
      // this[ _state ].cursor().update( cursor => {
      //     return cursor.merge( JSON.parse( state ) )
      // })
      this[ _state ].cursor().merge( JSON.parse( state ) )
    } catch( err ) {
      throw new Error( err )
    }
  }
}
