
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
    this.observers = []

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

    /**
     * Pass source observer events to all signal observers.
     * This ensures update functions run only once per event.
     */
    this.source.subscribe({
      next: this.onNext,
      error: this.onError
    })
  }

  /**
   * Instance methods for creating a new Signal
   * @constructs
   * @param initialState <any> an object is expected but any structure can be used
   */
  static of (initialState = {}) {
    return new Signal(initialState)
  }

  /**
   * Connects a new stream to the emitter, this requires the stream to emit
   * objects for the emitter to pass as events through the scanned source
   * stream.
   * @param stream <Stream> any object with an `observe` method
   * @returns <Promise>
   */
  mount = stream => {
    return stream.observe(this.emit)
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
   * @param onNext <Function> triggered for each action, passing back the
   *   current signal state
   * @param onError <Function> triggered for each stream error, passing
   *   back the current error
   * @param onNext <Object> observe can accept an object containing next
   *   and error handlers
   * @returns <null>
   */
  observe = (next, error) => {
    if (!next) {
      throw new Error('Observer required to subscribe/observe')
    }

    if (typeof next === 'function') {
      this.observers.push({
        next,
        error
      })
      return
    }

    if (!next.next) {
      throw new Error('Observer required to subscribe/observe')
    }

    this.observers.push({
      next: next.next,
      error: next.error
    })
  }

  /**
   * @alias observe
   */
  subscribe = this.observe

  /**
   * Observes the source stream and emits next events to all signal observers
   */
  onNext = (event) => {
    this.observers.forEach(o => o.next(event))
  }

  /**
   * Observes the source stream and emits error events to all signal observers
   */
  onError = (err) => {
    this.observers.forEach(o => o.error && o.error(err))
  }

  /**
   * Registers an update function with this signal
   * @param update <Function(state, event)> updates are called with the
   *   previous application state and the triggering event and are expected to
   *   return a representation of the new state
   * @param key <String<optional>> uid for the update function
   * @returns <Function> dispose function to remove the update function
   */
  register = (update, key = uid()) => {
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
