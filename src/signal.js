
import {fromEvent} from 'most'
import EventEmitter from 'eventemitter3'

import {fold, uid} from './utils'

/**
 * Create a new signal which can be observed for state changes.
 * @class Signal
 */
class Signal {
  /**
   * Sets up the source stream.
   * State is held within the fold and can be observed for changes.
   * @constructs
   * @param initialState <any> an object is expected but any structure can be used
   */
  constructor (initialState = {}) {
    this.emitter = new EventEmitter()
    this.mutators = new Map()

    /**
     * Creates a source stream that holds application state
     */
    this.source = fromEvent('action', this.emitter)
      .scan((state, event) => {
        /**
         * Actions that request state changes are passed in to the stream with
         * side effects happening within the execution of mutator functions
         */
        return fold(this.mutators.values(), (state, mutator) => {
          return mutator(state, event)
        }, state)
      }, initialState)
  }

  /**
   * Emit a new action from this signal, this triggers a pass through the
   * mutator functions
   * @param payload <Object>
   * @returns <null>
   */
  emit = payload => {
    if (typeof payload !== 'object') {
      throw new Error('Incorrect payload type, expects object')
    }

    this.emitter.emit('action', payload)
  }

  /**
   * Applies an observer to the signal source
   * @param onAction <Function> triggered for each action, passing back the
   *   current signal state
   * @returns <null>
   */
  observe = (onAction, onError, onComplete) => {
    this.source.observe(
      onAction,
      onError,
      onComplete
    )
  }

  /**
   * @alias observe
   */
  subscribe = this.observe

  /**
   * Registers a mutator with this signal
   * @param mutator <Function(state, event)> mutators are called with the
   *   previous application state and the triggering event and are expected to
   *   return a representation of the new state
   * @param key <String<optional>> uid for the mutator
   * @returns <Function> dispose function to remove the mutator
   */
  register = (mutator, key = uid()) => {
    // let k = key || uid()
    this.mutators.set(key, mutator)

    return function dispose () {
      return this.dispose(key)
    }.bind(this)
  }

  /**
   * Removes a mutator function from the fold
   * @param key <String> identifier
   * @returns <Boolean>
   */
  dispose = key => {
    return this.mutators.delete(key)
  }
}

export default Signal
