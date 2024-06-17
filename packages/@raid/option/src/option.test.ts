import { describe, expect, test } from 'bun:test'

import { fromNullable, none, some } from './ctor'
import { option } from './model'
import type { Option } from './option'

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
    expect(some(10).ap(some(inverse))).toStrictEqual(some(0.1))
  })
})
