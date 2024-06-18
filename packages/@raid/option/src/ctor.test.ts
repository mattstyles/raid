import { describe, expect, test } from 'bun:test'
import { flow } from '@raid/flow'

import { fromNullable, fromPredicate } from './ctor'
import type { Option } from './model'
import { none, of, some } from './model'
import { flatMap, map } from './option'

describe('Constructor', () => {
  test('of', () => {
    expect(of(10)).toStrictEqual(some(10))
    expect(of(null)).toStrictEqual(none())
  })
})

describe('Constructor::fromNullable', () => {
  test('nullable function', () => {
    const inverse = (x: number) => (x === 0 ? null : 1 / x)
    const fn = fromNullable(inverse)

    expect(fn(0)).toStrictEqual(none())
    expect(fn(-10)).toStrictEqual(some(-0.1))
  })

  test('with flatmap', () => {
    const inverse = (x: number) => (x === 0 ? null : 1 / x)
    const fn = fromNullable(inverse)

    expect(some(5).flatMap(fn)).toStrictEqual(some(0.2))
    expect(some(0).flatMap(fn)).toStrictEqual(none())
    expect(none().flatMap(fn)).toStrictEqual(none())
  })

  test('multiple params', () => {
    const divide = (x: number, y: number) => (y === 0 ? null : x / y)
    const fn = fromNullable(divide)

    expect(fn(2, 0)).toStrictEqual(none())
    expect(fn(10, 5)).toStrictEqual(some(2))
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

  // You could refine afterwards if you really wanted to
  test('flow - refine output', () => {
    const inverse = (x: number) => 1 / x
    const refinement = (x: number) =>
      x === Number.POSITIVE_INFINITY ? none<number>() : some(x)
    const seq = flow(map(inverse), flatMap(refinement))

    expect(seq(some(0))).toStrictEqual(none())

    const seq2 = flow(inverse, refinement)
    expect(seq2(0)).toStrictEqual(none())
    expect(seq2(-4)).toStrictEqual(some(-0.25))

    const seq3 = flow(of<number>, map(inverse), flatMap(refinement))
    expect(seq3(0)).toStrictEqual(none())
    expect(seq3(10)).toStrictEqual(some(0.1))
  })

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
