
import type {Option} from './option'
import type {NonNullish} from './types'
import {Some, None} from './option'

export function fromNullable<T>(value: T): Option<NonNullish<T>> {
  return value == null ? None.of() : Some.of(value as NonNullish<T>)
}
