
import { Observable } from 'rx-lite'
import EventEmitter from 'eventemitter3'

const _emitter = Symbol( 'emitter' )
const _source = Symbol( 'source' )

export default class Signal {
  constructor( opts={} ) {
    const { model, key } = opts

    this[ _emitter ] = new EventEmitter()
    this[ _source ] = new Observable.fromEvent( this[ _emitter ], 'data' )

    if ( model ) {
      this.model = model
      this[ _source ] = this[ _source ]
        .map( event => Object.assign( event, {
          model: model.cursor( key || null )
        }))
    }
  }

  register( cb ) {
    let subscriber = cb( this[ _source ] )

    if ( subscriber && subscriber.dispose ) {
      return subscriber.dispose.bind( subscriber )
    } else {
      return subscriber
    }
  }

  dispatch( event ) {
    let dispatch = typeof event === 'string'
      ? { type: event }
      : event
    this[ _emitter ].emit( 'data', dispatch )
  }
}
