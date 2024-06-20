import { describe, expect, test } from 'bun:test'

import type { Option } from './model'
import { of } from './model'
import { ap, chain, map } from './option'

describe('derivations', () => {
  const double = (x: number) => x * 2

  test('map(fn)::ap(of(fn)', () => {
    const m = <T, U>(fn: (v: T) => U) => ap(of(fn))
    expect(m(double)(of(2))).toStrictEqual(map(double)(of(2)))
  })

  test('map(fn)::chain(a -> of(fn(a)))', () => {
    const m = <T, U>(fn: (v: T) => U) => chain<T, U>((v: T) => of(fn(v)))
    expect(m(double)(of(2))).toStrictEqual(map(double)(of(2)))
  })

  test('ap(fn)::chain(map(fn))', () => {
    const m =
      <T, U>(o: Option<(v: T) => U>) =>
      (a: Option<T>) =>
        o.chain<U>((fn) => map(fn)(a))

    expect(m(of(double))(of(2))).toStrictEqual(ap(of(double))(of(2)))
  })
})

describe('monad laws', () => {
  const identity = <T>(a: T) => a
  const double = <T extends number>(a: T) => a * 2
  const square = <T extends number>(a: T) => a * a

  describe('Functor/map', () => {
    test('identity', () => {
      const input = of(42)

      expect(map(identity)(input)).toStrictEqual(input)
      expect(input.map(identity)).toStrictEqual(input)
    })

    // x => of(x).map(f).map(g) ==> f(g(x))
    test('composition', () => {
      const i = 4
      expect(of(i).map(double).map(square)).toStrictEqual(of(square(double(i))))
      expect(of(i).map(double).map(square)).not.toStrictEqual(
        of(double(square(i))),
      )

      const o = of(i)
        .map(double)
        .map(square)
        .match(() => {
          throw new Error('test fails')
        })
      expect(o).toBe(64)
    })
  })

  describe('Apply/ap', () => {
    // x => of(x).ap(f).ap(g) ==> x => f(g(x))
    test('composition', () => {
      const i = 5

      expect(of(i).ap(of(double)).ap(of(square))).toStrictEqual(
        of(square(double(i))),
      )
      expect(of(i).ap(of(double)).ap(of(square))).not.toStrictEqual(
        of(double(square(i))),
      )
    })
  })

  describe('Chain/flatMap', () => {
    // of(x).chain(f).chain(g) ==> chain(x => f(x)).chain(x => g(x))
    test('associativity', () => {
      const f = <T extends number>(x: T) => of(x * 2)
      const g = <T extends number>(x: T) => of(x * x)

      const o = of(4).chain(f).chain(g)
      const u = of(4)
        .chain((x) => f(x))
        .chain((x) => g(x))

      expect(o).toStrictEqual(u)
    })
  })

  describe('Applicative/of', () => {
    test('identity', () => {
      const input = 'id'
      const o = of(input).ap(of(identity))
      const u = of(input)

      expect(o).toStrictEqual(u)
    })

    test('homomorphism', () => {
      const input = 42
      const o = of(input).ap(of(double))
      const u = of(double(input))
      expect(o).toStrictEqual(u)
    })

    test('interchange', () => {
      const input = true
      const o = of(input).ap(of(identity))
      const u = of(identity).ap(of((f) => f(input)))
      expect(o).toStrictEqual(u)

      // pointed
      const f = <T>(x: T) => of(x).ap(of(identity))
      const g = <T>(x: T) => of(identity).ap(of((f) => f(x)))
      expect(f(true)).toStrictEqual(g(true))
    })
  })
})
