import type { IfNever, IfUnknown } from 'type-fest'
import type { Result } from './model'
import type { IfError, IfVoid, NonError } from './types'

// map
// flatmap
// match

export function map<T, U>(fn: (value: T) => U) {
  return function mapResult(res: Result<T>) {
    return res.map(fn)
  }
}

export function flatMap<T, U>(fn: (value: T) => Result<U>) {
  return function flatMapResult(res: Result<T>) {
    return res.flatMap(fn)
  }
}

export function match<T>(...args: Parameters<Result<T>['match']>) {
  return function matchResult(res: Result<T>) {
    return res.match(...args)
  }
}
