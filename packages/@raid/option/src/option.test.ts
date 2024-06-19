import { describe, expect, test } from 'bun:test'
import { flow } from '@raid/flow'

import { fromPredicate } from './ctor'
import { none, of, some } from './model'
import type { Option } from './model'
import { ap, flatMap, map, match } from './option'

describe('Match returns values', () => {
  test('Some case takes precedence over the none case', () => {
    expect(of(10).match(() => 42)).toBe(10)
    expect(
      of(10).match(
        () => 42,
        (value) => value + 10,
      ),
    ).toBe(20)
    expect(of(null).match(() => 42)).toBe(42)
  })

  test('None always returns the none clause return', () => {
    expect(of(null).match(() => 'foo')).toBe('foo')
    expect(
      of(undefined).match(
        () => 'foo',
        () => 'bar',
      ),
    ).toBe('foo')
  })

  test('Match does not require a return type', () => {
    expect(of(null).match(() => {})).toBe(undefined)
    expect(
      of(null).match(
        () => {},
        () => 42,
      ),
    ).toBe(undefined)
    expect(
      of(42).match(
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

    expect(of(null).isSome()).toBe(false)
  })
})

describe('Map', () => {
  test('some', () => {
    expect(
      of(42)
        .map(() => true)
        .match(
          () => false,
          () => true,
        ),
    ).toBeTruthy()

    expect(of(42).map(() => 'foo')).toEqual(some('foo'))
  })

  test('none', () => {
    expect(
      of(null)
        .map(() => false)
        .match(
          () => false,
          () => true,
        ),
    ).toBeFalsy()
  })
})

describe('flatMap', () => {
  function inverse(x: number) {
    if (x === 0) {
      return none()
    }
    return some(1 / x)
  }

  test('some', () => {
    expect(some(2).flatMap(inverse)).toStrictEqual(some(0.5))
  })
  test('none', () => {
    expect(none().flatMap(inverse)).toStrictEqual(none())
  })
})

describe('applicative', () => {
  // function inverse(x: Option<number>) {
  //   return x.map((value) => 1 / value)
  // }
  function inverse(x: number) {
    return 1 / x
  }

  const fn = some(inverse) as Option<typeof inverse>
  const n = none<number>() as Option<number>

  test('none', () => {
    expect(n.ap(fn)).toStrictEqual(none())
  })

  test('some', () => {
    expect(some(10).ap(fn)).toStrictEqual(some(0.1))
  })

  test('applicative with none type', () => {
    expect(some(10).ap(none())).toStrictEqual(none())
    expect(none().ap(none())).toStrictEqual(none())
  })
})

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
    const seq = flow(map(double), map(inverse), map(square))
    expect(seq(some(0))).toStrictEqual(none())
    expect(seq(some(2))).toStrictEqual(some(1 / 16))
  })
})

describe('Option::flatMap', () => {
  const inverse = (x: number) => (x === 0 ? none() : some(1 / x))

  test('flatmap option', () => {
    expect(flatMap(inverse)(none())).toStrictEqual(none())
    expect(flatMap(inverse)(some(0))).toStrictEqual(none())
    expect(flatMap(inverse)(some(8))).toStrictEqual(some(0.125))
  })

  test('with flow', () => {
    const hasNumbers = fromPredicate((x: string) => /[0-9]/g.test(x))
    const hasSpecials = fromPredicate((x: string) => /[!|?|*]/g.test(x))
    const isLonger = (x: number) => (y: string) => y.length > x
    const assert = flow(
      map((x: string) => Boolean(x)),
      match(
        () => false,
        () => true,
      ),
    )

    const validate = flow(
      flatMap(hasNumbers),
      flatMap(hasSpecials),
      flatMap(fromPredicate(isLonger(8))),
      assert,
    )

    expect(validate(some('foo'))).toBeFalsy()
    expect(validate(some('f0!o'))).toBeFalsy()
    expect(validate(some('foo!bar?baz'))).toBeFalsy()
    expect(validate(some('foo!bar?baz23456'))).toBeTruthy()
  })
})

describe('Option::match', () => {
  test('Preserves type', () => {
    const add = match(
      () => -1,
      (v) => v + 1,
    )

    expect(add(some(10))).toBe(11)
    expect(add(none())).toBe(-1)

    // @ts-expect-error match preserves type
    add(some('foo'))

    match(
      () => true,
      // @ts-expect-error some clause must match none clause type
      () => 'false',
    )
  })

  test('Handles unknown type', () => {
    const truthy = match<unknown>(
      () => false,
      () => true,
    )
    expect(truthy(of<unknown>('foo'))).toBeTruthy()
    expect(truthy(of<unknown>(null))).toBeFalsy()
  })

  test('with flow', () => {
    const reLU = flow(
      fromPredicate((x: number) => x > 0),
      match(() => 0),
    )

    expect(reLU(0)).toBe(0)
    expect(reLU(0.5)).toBe(0.5)
    expect(reLU(2)).toBe(2)
    expect(reLU(-2)).toBe(0)
  })
})

describe('option::apply', () => {
  test('option', () => {
    const inc = of((x: number) => x + 1)

    expect(ap(inc)(some(1))).toStrictEqual(some(2))
    expect(ap(inc)(none<number>())).toStrictEqual(none())
    expect(ap(none<(x: number) => number>())(some(1))).toStrictEqual(none())
  })
})
