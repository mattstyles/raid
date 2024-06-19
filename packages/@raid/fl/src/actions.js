
import forceArray from 'force-array'
import fl from 'fantasy-land'

import { isString } from './utils'

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
  var action = {
    [name]: class {
      constructor (value) {
        this.__value = value
        this['@@type'] = name
      }

      static [fl.of] (value) {
        return new action[name](value)
      }

      static of (value) {
        return new action[name](value)
      }

      static is (type) {
        return type instanceof action[name]
      }

      [fl.map] (fn) {
        return action[name].of(fn(this.join()))
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
    }
  }
  return aliasType(action[name])
}

export const createActions = actions => forceArray(actions)
  .filter(isString)
  .map(createAction)

export const connect = signal => actions =>
  createActions(actions)
    .map(Action => {
      Action.of = value => {
        const action = new Action(value)
        signal.emit(action)
        return action
      }
      Action[fl.of] = Action.of
      return Action
    })
