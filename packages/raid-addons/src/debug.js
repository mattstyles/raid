
export const debug = (pre = '') => {
  if (typeof pre !== 'string') {
    throw new Error('raid-addons::debug expects a string')
  }

  return (state, event) => {
    if (!console.group || !console.groupEnd) {
      console.log(pre, state, ':::', event)
      return state
    }

    const type = event.type || event['@@type']
    const group = type
      ? pre + ' ' + type
      : pre + ' raid'

    console.group(group)
    console.log(state)
    console.log(event)
    console.groupEnd(group)

    return state
  }
}
