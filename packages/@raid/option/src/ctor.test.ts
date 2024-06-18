import { describe, expect, test } from 'bun:test'

import { fromNullable } from './ctor'
import { none, some } from './model'

describe('Constructor::fromNullable', () => {
  test('fromNullable', () => {
    const inverse = (x: number) => (x === 0 ? null : 1 / x)
    expect(fromNullable(inverse)(0)).toStrictEqual(none())
    expect(fromNullable(inverse)(10)).toStrictEqual(some(0.1))
  })
})

describe('Constructor::fromPredicate', () => {})
