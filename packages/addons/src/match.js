
import _match from '@mattstyles/match'

/**
 * Cache match function, pass through update arguments and expect match
 * arms to comply to update arity.
 */
export const match = matcher => {
  const _matcher = _match(
    matcher
      .map(([p, arm]) => {
        if (!arm) {
          return null
        }

        return [
          ({ event }) => p(event),
          ({ state, event }) => arm(state, event)
        ]
      })
      .filter(v => !!v)
      .concat([[({ state }) => state]])
  )
  return (state, event) => _matcher({ state, event })
}
