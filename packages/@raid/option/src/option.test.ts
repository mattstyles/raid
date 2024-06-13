import {describe, expect, test} from 'bun:test'

import {fromNullable} from './ctor'

describe('Match returns values', () => {
  test('Some case takes precedence over the none case', () => {
    expect(fromNullable(10).match(() => 42)).toBe(10)
    expect(fromNullable(10).match(() => 42, (value) => value + 10)).toBe(20)
    expect(fromNullable(null).match(() => 42)).toBe(42)
  })

  test('None always returns the none clause return', () => {
    expect(fromNullable(null).match(() => 'foo')).toBe('foo')
    expect(fromNullable(undefined).match(() => 'foo', () => 'bar')).toBe('foo')
  })

  test('Match does not require a return type', () => {
    expect(fromNullable(null).match(() => {})).toBe(undefined)
    expect(fromNullable(null).match(() => {}, () => 42)).toBe(undefined)
    expect(fromNullable(42).match(() => {}, () => {})).toBe(undefined)
  })
})

