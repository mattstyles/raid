import { None, Some, option } from './model'
import type { NonNullish } from './types'

export function some<T>(value: NonNullish<T>) {
  return Some.of(value)
}

export function none<T = never>() {
  return None.of<T>()
}

export function fromNullable<
  // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
  Fn extends (...args: ReadonlyArray<any>) => unknown,
>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    return option<ReturnType<Fn>>(fn(...args) as ReturnType<Fn>)
  }
}
