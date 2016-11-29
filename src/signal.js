
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
    this.updates = new Map()

    /**
     * Creates a source stream that holds application state
     */
    this.source = fromEvent('action', this.emitter)
      .scan((state, event) => {
        /**
         * Actions that request state changes are passed in to the stream with
         * side effects happening within the execution of update functions
         */
        return fold(this.updates.values(), (state, update) => {
          return update(state, event)
        }, state)
      }, initialState)
  }

  /**
   * Emit a new action from this signal, this triggers a pass through the
   * update functions
   * @param payload <Object>
   * @returns <null>
   */
  emit = payload => {
    if (typeof payload !== 'object') {
      throw new Error('Incorrect payload type, expects object')
    }

    setTimeout(() => {
      this.emitter.emit('action', payload)
    }, 0)
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
   * Registers an update function with this signal
   * @param update <Function(state, event)> updates are called with the
   *   previous application state and the triggering event and are expected to
   *   return a representation of the new state
   * @param key <String<optional>> uid for the update function
   * @returns <Function> dispose function to remove the update function
   */
  register = (update, key = uid()) => {
    // let k = key || uid()
    this.updates.set(key, update)

    return function dispose () {
      return this.dispose(key)
    }.bind(this)
  }

  /**
   * Removes a update function from the fold
   * @param key <String> identifier
   * @returns <Boolean>
   */
  dispose = key => {
    return this.updates.delete(key)
  }
}

export default Signal
