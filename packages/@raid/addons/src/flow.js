
export function flow () {
  let fns = Array.from(arguments)
  return (state, event) =>
    fns.reduce((newState, fn) => fn(newState, event), state)
}
