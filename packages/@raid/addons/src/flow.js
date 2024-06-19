export function flow(...args) {
  const fns = Array.from(args)
  return (state, event) =>
    fns.reduce((newState, fn) => fn(newState, event), state)
}
