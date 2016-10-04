
/**
 * A fold function for iterator values
 * @returns <any> the result of folding the iterator values
 * @param it <Map> passes values to the supplied reducer
 * @param fn <Function> scan/reduce/fold, the callback working on the list
 * @param initial <any> _optional_ if omitted null will be passed to the first
 * callback
 */
export const iteratorFold = (it, fn, initial) => {
  for (const value of it) {
    initial = fn(initial, value)
  }
  return initial
}

/**
 * Returns a random string
 */
export const uid = () => {
  return (Math.random() * 10000000)
    .toFixed(0)
    .toString(16)
}
