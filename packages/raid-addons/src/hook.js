
const checkString = str => type => str === type
const checkRegex = re => type => re.test(type)
const checkFn = fn => function () {
  return fn(...arguments)
}
const checkTrue = () => true

const isString = v => typeof v === 'string'
const isRegex = v => v instanceof RegExp
const isFn = v => typeof v === 'function'

const check = predicate => {
  return (isString(predicate) && checkString(predicate)) ||
    (isRegex(predicate) && checkRegex(predicate)) ||
    (isFn(predicate) && checkFn(predicate)) ||
    checkTrue
}

/**
 * Creates a hook that runs on every emit and matches on an event
 * type predicate
 */
const hook = (fn, opts = {}) => {
  let predicate = opts.predicate || null
  let match = check(predicate)
  return (state, event) => {
    let type = typeof event === 'string' || isFn(predicate)
      ? event
      : event.type
    return match(type)
      ? fn(state, event)
      : state
  }
}

export default hook
