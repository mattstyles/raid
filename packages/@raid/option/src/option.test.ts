import { describe, expect, test } from 'bun:test'

import { fromNullable, none, option, some } from './ctor'

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
