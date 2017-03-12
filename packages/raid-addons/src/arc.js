
const arc = fn => (state, event) => {
  fn(state, event)
  return state
}

export default arc
