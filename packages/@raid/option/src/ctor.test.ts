import { describe, expect, test } from 'bun:test'
import { flow } from '@raid/flow'

import { fromPredicate } from './ctor'
import { none, of, some } from './model'
import { map } from './option'

describe('Constructor', () => {
  test('of', () => {
    expect(of(10)).toStrictEqual(some(10))
    expect(of(null)).toStrictEqual(none())
  })
})

describe('Constructor::fromPredicate', () => {
  test('predicate', () => {
    const gt = fromPredicate((x: number) => x > 0)
    expect(gt(10)).toStrictEqual(some(10))
    expect(gt(-1)).toStrictEqual(none())
  })

  // Where a function does not return null but still has cases it does not handle, i.e. refine the input to the function
  test('flow - refine input', () => {
    const inverse = (x: number) => 1 / x
    const notZero = (x: number) => x !== 0
    const seq = flow(fromPredicate(notZero), map(inverse))

    expect(seq(0)).toStrictEqual(none())
    expect(seq(-1)).toStrictEqual(some(-1))
  })

  // Where a function returns null.
  // Previously fromNullable.
  test('flow - refine null returning function', () => {
    const inverse = (x: number) => (x === 0 ? null : 1 / x)
    const safeInverse = flow(
      inverse,
      fromPredicate((x) => x != null),
    )

    expect(safeInverse(0)).toStrictEqual(none())
    expect(safeInverse(4)).toStrictEqual(some(0.25))
  })
})
