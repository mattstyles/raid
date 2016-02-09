
import immstruct from 'immstruct'
import Immutable from 'immutable'
import CONSTANTS from './constants'
import EventEmitter from 'eventemitter3'

const _state = Symbol( 'state' )

/**
 * @class
 * Holds data representing the current state of the application
 */
export default class State extends EventEmitter {

  /**
   * @constructs
   * A default namespace can be passed in here
   * @param key <String>
   * @param value <Object> _optional_ defaults to {}
   */
  constructor( key, value = {} ) {
    super()

    // Private state immstruct structure
    this[ _state ] = immstruct( 'app', {
      [ CONSTANTS.COMPONENTS ]: {}
    })

    if ( key && value ) {
      this.create( key, value )
    }

    this[ _state ].on( 'swap', this.onSwap )
  }

  /**
   * Check for a change and emit an update when one occurs
   */
  onSwap = ( o, n, k ) => {
    if ( !o ) {
      this.emit( 'update' )
      return
    }

    if ( o && n ) {
      // Check that a change really did happen
      if ( !Immutable.is( o.getIn( k ), n.getIn( k ) ) ) {
        this.emit( 'update' )
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
      throw new Error( 'No key specified when creating new appState root' )
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
