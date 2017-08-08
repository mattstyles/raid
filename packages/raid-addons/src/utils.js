
export const isDefined = value => value !== undefined
export const isString = v => typeof v === 'string'
export const isRegex = v => v instanceof RegExp
export const isFn = v => typeof v === 'function'

export const checkString = str => type => str === type
export const checkRegex = re => type => re.test(type)
export const checkFn = fn => function () {
  return fn(...arguments)
}
export const checkTrue = () => true

export const check = predicate => {
  return (isString(predicate) && checkString(predicate)) ||
    (isRegex(predicate) && checkRegex(predicate)) ||
    (isFn(predicate) && checkFn(predicate)) ||
    checkTrue
}
