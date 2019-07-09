
import { isDefined } from './utils'

const safe = fn => (state, event) => {
  const out = fn(state, event)
  return isDefined(out)
    ? out
    : state
}

export default safe
