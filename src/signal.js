
import { Observable } from 'rx-lite'
import EventEmitter from 'eventemitter3'

const _emitter = Symbol( 'emitter' )
const _source = Symbol( 'source' )

export default class Signal {
  constructor() {
    this[ _emitter ] = new EventEmitter()
    this[ _source ] = new Observable.fromEvent( this[ _emitter ], 'data' )
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
