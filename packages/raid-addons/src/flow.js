
function flow () {
  let fns = Array.from(arguments)
  return (state, event) => {
    return fns
      .reduce((newState, fn) => {
        return fn(newState, event)
      }, state)
  }
}

export default flow
