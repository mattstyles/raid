import type { Option } from '@raid/option'
import * as O from '@raid/option'
import { pipe } from '@raid/pipe'

// We could wrap here ourselves and accept (v: T) => U, in which case return v.map(fn)
export function each<T, U>(o: Option<(v: T) => U>) {
  return function e(xs: Array<Option<T>>) {
    return xs.map((v) => v.ap(o))
  }
}

const d = O.some((x: number) => x * 2)
const e = each(d)

const out = pipe(
  [-1, 2, 3].map((v) => O.some(v)),

  // O.of,
  // O.map((xs) => xs.map((x) => x * 2)),

  // Double
  each(O.some((x) => x * 2)),

  // Handle nullable
  each(O.some((x) => (x > 0 ? null : x))),

  // Handling nullable this way requires a flattening (O.flap instead of O.ap?? O.ap wraps in an O.of so a fromPredicate, which returns an Option, gets wrapped in another Option during the ap.)
  // each(O.some(O.fromPredicate((x: number) => x > 0))),

  // Filter nones and return values
  (xs) => xs.filter((x) => x.isSome()).map((x) => x.orElse(0)),
)

console.log(out)

function gte(x: number) {
  return function g(y: number) {
    return y >= x
  }
}

const f = O.fromPredicate(gte(10))
