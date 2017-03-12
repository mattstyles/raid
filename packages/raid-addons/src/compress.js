
const squash = key => update => (state, event) => {
  if (event.type !== key) {
    return state
  }
  return update(state, event.payload)
}

const compress = updates => {
  if (typeof updates === 'string') {
    return squash(updates)
  }
  return (state, event) => {
    let update = updates[event.type]
    if (update) {
      return update(state, event.payload)
    }
    return state
  }
}

export default compress
