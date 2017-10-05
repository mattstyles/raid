
import forceArray from 'force-array'

import {isString} from './utils'

export const createAction = name => {
  var action = {[name]: class {
    constructor (value) {
      this.__value = value
    }
    static of (value) {
      return new action[name](value)
    }
    static is (type) {
      return type instanceof action[name]
    }
    map (fn) {
      return action[name].of(fn(this.__value))
    }
    join () {
      return this.__value
    }
    chain (fn) {
      return this.map(fn).join()
    }
    ap (a) {
      return a.map(this.__value)
    }
    unwrapOrElse (_default) {
      return this.value || _default
    }

    // Aliases
    unwrap () {
      return this.join()
    }
  }}
  return action[name]
}

export const createActions = actions => forceArray(actions)
  .filter(isString)
  .map(createAction)
