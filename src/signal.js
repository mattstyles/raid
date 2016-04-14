
import { Observable } from 'rx-lite'
import EventEmitter from 'eventemitter3'

/**
 * Symbols for privacy
 */
const _emitter = Symbol( 'emitter' )
const _source = Symbol( 'source' )

/**
 * @class
 * Wraps RX to provide an event stream, optionally bound to a model
 */
export default class Signal {
  /**
   * @constructs
   * Creates the emitter and stream.
   * @param opts <Object>
   *   @param model <Object> an object representing the model associated with this stream
   *   @param key <String> a key on the model, the model will become a cursor to this value
   */
  constructor( opts={} ) {
    const { model, key } = opts

    this[ _emitter ] = new EventEmitter()
    this[ _source ] = new Observable.fromEvent( this[ _emitter ], 'data' )

    /**
     * If a model is passed then pass it back through the stream
     * If a key is also passed then pass a cursor to that value back
     */
    if ( model ) {
      this.model = model
      this[ _source ] = this[ _source ]
        .map( event => Object.assign( event, {
          model: model.cursor( key || null )
        }))
    }
  }

  /**
   * Registers a callback, passing the stream source as an argument
   * @param cb <Function>
   */
  register( cb ) {
    let subscriber = cb( this[ _source ] )

    if ( subscriber && subscriber.dispose ) {
      return subscriber.dispose.bind( subscriber )
    } else {
      return subscriber
    }
  }

  /**
   * Dispatches an event to the stream
   * @param event <String||Object> an event should contain at least a type, if
   *   only a string is provided then that will be used as the event type.
   */
  dispatch( event ) {
    let dispatch = typeof event === 'string'
      ? { type: event }
      : event
    this[ _emitter ].emit( 'data', dispatch )
  }
}
