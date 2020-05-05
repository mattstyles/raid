
import { isDefined } from './utils'

export const safe = fn => (state, event) => {
  const out = fn(state, event)
  return isDefined(out)
    ? out
    : state
}
