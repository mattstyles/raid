
import {fromEvent} from 'most'
import EventEmitter from 'eventemitter3'

import {iteratorFold, uid} from './utils'

class Signal {
  constructor (initialState = {}) {
    this.emitter = new EventEmitter()
    this.reducers = new Map()

    this.source = fromEvent('action', this.emitter)
      .scan((state, event) => {
        return iteratorFold(this.reducers.values(), (state, reducer) => {
          return reducer(state, event)
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
    this.reducers.set(k, reducer)

    return function dispose () {
      this.reducers.delete(k)
    }
  }
}

export default Signal
