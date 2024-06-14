import type { Option } from './option'
import { None, Some } from './option'
import type { NonNullish } from './types'

export function some<T>(value: T) {
  return Some.of(value)
}

export function none() {
  return None.of()
}

export function option<T>(value: T): Option<NonNullish<T>> {
  return value == null ? None.of() : Some.of(value as NonNullish<T>)
}

export function fromNullable<
  // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
  Fn extends (...args: ReadonlyArray<any>) => unknown,
>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    return option<ReturnType<Fn>>(fn(...args) as ReturnType<Fn>)
  }
}
