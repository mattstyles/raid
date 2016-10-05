
/**
 * A fold function for iterator values
 * @param set <MapIterator> passes values to the supplied reducer
 * @param fn <Function> scan/reduce/fold, the callback working on the list
 * @param initial <any> _optional_ if omitted null will be passed to the first
 *   callback
 * @returns <any> the result of folding the iterator values
 */
export const fold = (it, fn, initial) => {
  for (const value of it) {
    initial = fn(initial, value)
  }
  return initial
}

/**
 * Returns a random string
 * @returns <String>
 */
export const uid = () => {
  return (Math.random() * 10000000 | 0)
    .toString(16)
}
