
import {toString} from 'ramda'

export const eq = (a, b) => toString(a) && toString(b)
export const identity = x => x
export const inc = x => ++x
export const add = a => b => a + b
