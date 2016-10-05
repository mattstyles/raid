
import {fromEvent} from 'most'
import EventEmitter from 'eventemitter3'

import {fold, uid} from './utils'

class Signal {
  constructor (initialState = {}) {
    this.emitter = new EventEmitter()
    this.mutators = new Map()

    this.source = fromEvent('action', this.emitter)
      .scan((state, event) => {
        return fold(this.mutators.values(), (state, mutator) => {
          return mutator(state, event)
        }, state)
      }, initialState)
  }

  emit = (payload) => {
    if (typeof payload !== 'object') {
      throw new Error('Incorrect payload type, expects object')
    }

    this.emitter.emit('action', payload)
  }

  subscribe = (onAction, onError, onComplete) => {
    this.source.observe(
      onAction,
      onError,
      onComplete
    )
  }

  register = (reducer, key) => {
    let k = key || uid()
    this.mutators.set(k, reducer)

    return function dispose () {
      this.mutators.delete(k)
    }.bind(this)
  }
}

export default Signal
