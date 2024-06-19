const squash = (key) => (update) => (state, event) => {
  if (event.type !== key) {
    return state
  }
  return update(state, event.payload)
}

export const compress = (updates) => {
  if (typeof updates === 'string') {
    return squash(updates)
  }
  return (state, event, signal) => {
    const update = updates[event.type]
    if (update) {
      return update(state, event.payload, signal)
    }
    return state
  }
}
