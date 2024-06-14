import { describe, expect, test } from 'bun:test'

import { fromNullable, none, some } from './ctor'
import { option } from './model'

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
