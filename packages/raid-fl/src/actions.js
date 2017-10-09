
import forceArray from 'force-array'
import fl from 'fantasy-land'

import {isString} from './utils'

const rFANTASY = /^fantasy-land\//

const alias = c => Object.getOwnPropertyNames(c)
  .filter(n => rFANTASY.test(n))
  .map(n => ([n.replace(rFANTASY, ''), c[n]]))

const aliasType = c => {
  alias(c).forEach(([alias, fn]) => {
    c[alias] = fn
  })
  alias(c.prototype).forEach(([alias, fn]) => {
    c.prototype[alias] = fn
  })
  return c
}

export const createAction = name => {
  var a = {[name]: class {
    constructor (value) {
      this.__value = value
    }
    static [fl.of] (value) {
      return new a[name](value)
    }
    static of (value) {
      return new a[name](value)
    }
    static is (type) {
      return type instanceof a[name]
    }
    [fl.map] (fn) {
      return a[name].of(fn(this.join()))
    }
    [fl.ap] (m) {
      return m.chain(fn => this.map(fn))
    }
    [fl.chain] (fn) {
      return fn(this.join())
    }
    [fl.equals] (a) {
      return a.join() === this.join()
    }
    lift (m) {
      return m.map(this.__value)
    }
    join () {
      return this.__value
    }
    unwrapOrElse (_default) {
      return typeof this.join() === 'undefined'
        ? _default
        : this.join()
    }
  }}
  return aliasType(a[name])
}

export const createActions = actions => forceArray(actions)
  .filter(isString)
  .map(createAction)
