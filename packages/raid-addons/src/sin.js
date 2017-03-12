
function fold (updates, state, event) {
  return Promise
    .all(updates.map(update => update(state, event)))
}

function sin () {
  let key = Math.random().toString(16).slice(4)
  let updates = Array.from(arguments).slice(1, arguments.length)
  let signal = arguments[0]

  if (!signal || !signal.emit) {
    throw new Error('[Sin] requires an emitter source')
  }

  return (state, event) => {
    if (event.type === key) {
      return event.payload
    }

    Promise
      .resolve(fold(updates, state, event))
      .then(res => {
        let collected = res
          .reduce(newState => ({state, ...newState}), state)

        signal.emit({
          type: key,
          payload: collected
        })
      })

    return state
  }
}

export default sin
