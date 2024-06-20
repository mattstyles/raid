import type { Option, Value } from './model'

export function ap<T, U>(fn: Option<(value: T) => U>) {
  return function apOption(o: Option<T>) {
    return o.ap(fn)
  }
}

export function map<T, U>(fn: (value: T) => U) {
  return function mapOption(o: Option<T>) {
    return o.map(fn)
  }
}

export function chain<T, U>(fn: (value: T) => Option<Value<U>>) {
  return function chainO(o: Option<T>) {
    return o.chain(fn)
  }
}

/**
 * @alias chain
 */
export const flatMap = chain

export function match<T>(...args: Parameters<Option<T>['match']>) {
  return function matchOption(o: Option<T>) {
    return o.match(...args)
  }
}
