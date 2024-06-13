
import {Some, None} from './option'

export function fromNullable<T>(value: T) {
  return value == null ? None.of() : Some.of(value)
}
