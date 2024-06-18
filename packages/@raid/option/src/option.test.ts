import { describe, expect, test } from 'bun:test'
import { flow } from '@raid/flow'

import { fromNullable } from './ctor'
import { none, option, some } from './model'
import type { Option } from './model'
import { map } from './option'
import type { NonNullish } from './types'

describe('Match returns values', () => {
  test('Some case takes precedence over the none case', () => {
    expect(option(10).match(() => 42)).toBe(10)
    expect(
      option(10).match(
        () => 42,
        (value) => value + 10,
      ),
    ).toBe(20)
    expect(option(null).match(() => 42)).toBe(42)
  })

  test('None always returns the none clause return', () => {
    expect(option(null).match(() => 'foo')).toBe('foo')
    expect(
      option(undefined).match(
        () => 'foo',
        () => 'bar',
      ),
    ).toBe('foo')
  })

  test('Match does not require a return type', () => {
    expect(option(null).match(() => {})).toBe(undefined)
    expect(
      option(null).match(
        () => {},
        () => 42,
      ),
    ).toBe(undefined)
    expect(
      option(42).match(
        () => {},
        () => {},
      ),
    ).toBe(undefined)
  })
})

describe('Narrowing', () => {
  test('isX', () => {
    expect(some(10).isSome()).toBe(true)
    expect(none().isSome()).toBe(false)

    expect(option(null).isSome()).toBe(false)
  })
})

describe('Map', () => {
  test('some', () => {
    expect(
      option(42)
        .map(() => true)
        .match(
          () => false,
          () => true,
        ),
    ).toBeTruthy()

    expect(option(42).map(() => 'foo')).toEqual(option('foo'))
  })

  test('none', () => {
    expect(
      option(null)
        .map(() => false)
        .match(
          () => false,
          () => true,
        ),
    ).toBeFalsy()
  })
})

// describe('flatMap', () => {
//   function inverse(x: number) {
//     if (x === 0) {
//       return none()
//     }
//     return some(1 / x)
//   }

//   test('some', () => {
//     expect(some(2).flatMap(inverse)).toStrictEqual(some(0.5))
//   })
//   test('none', () => {
//     expect(none().flatMap(inverse)).toStrictEqual(none())
//   })
// })

// describe('applicative', () => {
//   // function inverse(x: Option<number>) {
//   //   return x.map((value) => 1 / value)
//   // }
//   function inverse(x: number) {
//     return 1 / x
//   }

//   const fn = some(inverse) as Option<typeof inverse>
//   const n = none<number>() as Option<number>

//   test('none', () => {
//     expect(n.ap(fn)).toStrictEqual(none())
//   })

//   test('some', () => {
//     expect(some(10).ap(some(inverse))).toStrictEqual(some(0.1))
//   })
// })

describe('Option::map', () => {
  const double = (x: number) => x * 2
  const inverse = (x: number) => {
    if (x === 0) {
      return null
    }
    return 1 / x
  }
  const square = (x: number) => x ** 2

  test('maps an option', () => {
    expect(map(double)(some(10))).toStrictEqual(some(20))
    expect(map(double)(none())).toStrictEqual(none())

    expect(map(inverse)(some(2))).toStrictEqual(some(0.5))
    expect(map(inverse)(none())).toStrictEqual(none())
    expect(map(inverse)(some(0))).toStrictEqual(none())
  })

  test('map with flow', () => {
    const seq = flow(map(double), map(square))
    expect(seq(some(2))).toStrictEqual(some(16))
  })

  test('map flow with none', () => {
    // @TODO this should be handled by functions i.e. a function should be able to return none but we handle it at the end, not at each individual function.
    const seq = flow(map(double), map(inverse), map(square))

    const o = some(10).map(inverse)
  })
})

// // Function can return number or null, we want to refine to only number, how?
// const inverse = (x: number) => {
//   if (x === 0) {
//     return null
//   }
//   return 1 / x
// }
// option<number>(inverse(12))
// const fn = fromNullable(inverse)
// const oo = fn(12)
// option(12).flatMap(fn)

// const s = some(12)
// const n = none()
// function foo(x: Option<number>) {
//   return x
// }
// function bar(x: number) {
//   return x === 0 ? none() : some(x)
// }

// function isNonNullish<T>(x: T): x is NonNullable<T> {
//   return x != null
// }
// const b: null | number = 2
// if (isNonNullish(b)) {
//   console.log(b)
// }

// foo(bar(12))
// foo(bar(0))

// function fnn<A extends ReadonlyArray<any>, B>(fn: (...args: A) => B) {
//   return (...args: A) => {
//     const value = fn(...args)
//     if (isNonNullish(value)) {
//       return some(value)
//     }

//     return none()
//   }
// }
// const fn4 = fnn(inverse)
