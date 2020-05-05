
export const arc = signal => {
  let internal = {}
  signal.observe(state => {
    internal = state
  })
  const getState = selector => selector ? selector(internal) : internal
  return fn => (state, event) => {
    fn(getState, event, signal)
    return state
  }
}
