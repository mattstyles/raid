
const safe = fn => (state, event) => fn(state, event) || state

export default safe
