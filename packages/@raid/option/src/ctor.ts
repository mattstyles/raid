import { None, Some, option } from './model'

export function some<T>(value: T) {
  return Some.of(value)
}

export function none() {
  return None.of()
}

export function fromNullable<
  // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
  Fn extends (...args: ReadonlyArray<any>) => unknown,
>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    return option<ReturnType<Fn>>(fn(...args) as ReturnType<Fn>)
  }
}
