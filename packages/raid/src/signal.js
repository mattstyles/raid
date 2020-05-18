
import { fromEvent } from 'most'
import { hold } from '@most/hold'
import EventEmitter from 'eventemitter3'

import { fold, uid } from './utils'

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
    this.observers = new Map()

    /**
     * Creates a held source stream that holds application state.
     * Held streams output the last value on subscription.
     */
    this.source = hold(
      fromEvent('action', this.emitter)
        .scan((state, event) => {
          /**
           * Actions that request state changes are passed in to the stream with
           * side effects happening within the execution of update functions
           */
          return fold(this.updates.values(), (state, update) => {
            return update(state, event)
          }, state)
        }, initialState)
    )

    // @TODO investigate why unsubscribing this sole subscriber
    // causes double events when the next observer comes in.
    this.source.subscribe({
      next: function debug () {}
    })
    // subscription.unsubscribe()
  }

  /**
   * Instance method for creating a new Signal
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
   * @param next <Function> triggered for each action, passing back the
   *   current signal state
   * @param error <Function> triggered for each stream error, passing
   *   back the current error
   * @param options <Object> uid for the listener
   * @param options.key <String<optional>>
   * @param options.subscription <Object> Will be preferred over next and error if supplied
   * @returns <Function> detach function to remove the observe function
   */
  observe = (next, error, {
    key = uid(),
    subscription = {}
  } = {}) => {
    if (!next && !subscription.next) {
      throw new Error('Observer required to subscribe/observe')
    }

    const observer = this.source.subscribe({
      next,
      error
    })

    this.observers.set(key, observer)

    return function detach () {
      this.detach(key)
    }.bind(this)
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
    this.updates.set(key, update)

    return function dispose () {
      return this.dispose(key)
    }.bind(this)
  }

  /**
   * Removes an update function from the fold
   * @param key <String> identifier
   * @returns <Boolean>
   */
  dispose = key => {
    return this.updates.delete(key)
  }

  /**
   * Removes all updates from a signal
   * @returns <Boolean||Array> true if successful, an array of failed keys if not
   */
  disposeAll = () => {
    const results = []
    for (const update of this.updates.keys()) {
      const res = this.updates.delete(update)
      if (!res) {
        results.push(update)
      }
    }
    return results.length ? results : true
  }

  /**
   * Removes an observer
   * @param key <String> identifier
   * @returns <Boolean>
   */
  detach = key => {
    try {
      const observer = this.observers.get(key)

      if (observer) {
        observer.unsubscribe()
      }
    } catch (err) {
      return err
    }

    return this.observers.delete(key)
  }

  /**
   * Removes all observers from a signal
   * @returns <Boolean||Array> true if successful, an array of failed keys if not
   */
  detachAll = () => {
    const results = []
    for (const listener of this.observers.keys()) {
      const res = this.observers.delete(listener)
      if (res instanceof Error) {
        results.push(listener)
      }
    }
    return results.length ? results : true
  }
}

export default Signal
