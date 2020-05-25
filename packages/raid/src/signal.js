
import { fromEvent } from 'most'
import { hold } from '@most/hold'
import EventEmitter from 'eventemitter3'

import { fold, uid } from './utils'

const eventKey = 'action'

/**
 * Create a new signal which can be observed for state changes.
 * @class Signal
 */
export class Signal {
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
    this.applicators = new Map()
    this.current = initialState

    /**
     * Creates a held source stream that holds application state.
     * Held streams output the last value on subscription.
     */
    this.source = hold(
      fromEvent(eventKey, this.emitter)
        .scan((state, event) => {
          /**
           * Actions that request state changes are passed in to the stream with
           * side effects happening within the execution of update functions
           */
          return fold(this.updates.values(), (state, update) => {
            // Apply applicators to each update
            let up = update
            if (this.applicators.size > 0) {
              for (const apply of this.applicators.values()) {
                up = apply(update)
              }
            }

            // Execute the update and return the result to the fold
            return up(state, event)
          }, state)
        }, initialState)
        .tap(state => {
          this.current = state
        })
    )

    // @TODO investigate why unsubscribing this sole subscriber
    // causes double events when the next observer comes in.
    // @TODO how to utilise these internally
    this.source.subscribe({
      next: function debug () {},
      error: function debug () {}
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
   * objects for the emitter to pass as events.
   * Signals can also be mounted, whereby this source Signal will also receive
   * all events passed through the mounted signal.
   * @param stream <Stream|Signal> any object with a subscribe method. See [ES Observable proposal](https://tc39.es/proposal-observable/) or an instance of a Signal.
   * @returns <Subscription|Function> allows a method to unmount
   */
  mount = stream => {
    // Mount a signal
    if (stream instanceof Signal) {
      stream.emitter.on(eventKey, this.emit)

      return function unmount () {
        stream.emitter.removeListener(eventKey, this.emit)
      }.bind(this)
    }

    // Mount an observable
    return stream.subscribe({
      next: this.emit
    })
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
      this.emitter.emit(eventKey, payload)
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
    if (typeof next !== 'function' && !subscription.next) {
      throw new Error('Observer required to subscribe/observe')
    }

    const sub = subscription.next
      ? subscription
      : { next, error }

    const observer = this.source.subscribe(sub)

    this.observers.set(key, observer)

    return function detach () {
      this.detach(key)
    }.bind(this)
  }

  /**
   * Implements subscribe, passing parameters to observe.
   * @param subscription <Object> mostjs stream type Subscription
   * @returns <Function> detach function to remove the subscription
   */
  subscribe = subscription => {
    return this.observe(null, null, { subscription })
  }

  /**
   * Registers an update function with this signal
   * @param update <Function(state, event)> updates are called with the
   *   previous application state and the triggering event and are expected to
   *   return a representation of the new state
   * @param options <Object> uid for the update
   * @param options.key <String<optional>> uid for the update function
   * @returns <Function> dispose function to remove the update function
   */
  register = (update, {
    key = uid()
  } = {}) => {
    if (typeof update !== 'function') {
      throw new Error('Update function required to apply to the Raid:Signal')
    }

    this.updates.set(key, update)

    return function dispose () {
      return this.dispose(key)
    }.bind(this)
  }

  /**
   * Registers an applicator function with this signal
   * @param applicator <Function> => <Function(state, event)> applicators are
   * applied to every update through the stream.
   * @param options <Object> uid for the applicator
   * @param options.key <String<optional>> uid for the applicator function
   * @returns <Function> dispose function to remove the applicator function
   */
  apply = (applicator, {
    key = uid()
  } = {}) => {
    if (typeof applicator !== 'function') {
      throw new Error('Applicator function required to apply to the Raid:Signal')
    }

    this.applicators.set(key, applicator)

    return function remove () {
      return this.remove(key)
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
   * Removes an applicator function from the signal
   * @param key <String> identifier
   * @returns <Boolean>
   */
  remove = key => {
    return this.applicators.delete(key)
  }

  /**
   * Removes all applicators from a signal
   * @returns <Boolean||Array> true if successful, an array of failed keys if not
   */
  removeAll = () => {
    const results = []
    for (const applicator of this.applicators.keys()) {
      const res = this.applicators.delete(applicator)
      if (!res) {
        results.push(applicator)
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
