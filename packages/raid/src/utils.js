/**
 * A fold function for iterator values
 * @param it <MapIterator> passes values to the supplied reducer
 * @param fn <Function> scan/reduce/fold, the callback working on the list
 * @param initial <any> _optional_ if omitted null will be passed to the first
 *   callback
 * @returns <any> the result of folding the iterator values
 */
export const fold = (it, fn, initial) => {
  let i = initial
  for (const value of it) {
    i = fn(i, value)
  }
  return i
}

/**
 * Returns a unique string (unique only during the execution of the program)
 * @returns <String>
 */
let i = 0
export const uid = () => {
  return (++i).toString(32)
}
