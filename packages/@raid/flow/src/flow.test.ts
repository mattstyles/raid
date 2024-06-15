import { describe, expect, test } from 'bun:test'

import { flow } from './flow'

function identity<T>(x: T): T {
  return x
}
function toStr<T>(x: T): string {
  return `${x}`
}
function toNum<T>(x: T): number {
  return Number(x)
}

describe('Flow', () => {
  test('Handles arity', () => {
    const tests = [
      {
        fixture: flow(identity),
        expected: 1,
      },
      {
        fixture: flow(identity, identity),
        expected: 1,
      },
    ]

    for (const { fixture, expected } of tests) {
      expect(fixture(expected)).toBe(expected)
    }
  })

  test('Handles type conversion', () => {
    expect(flow(toStr)(10)).toBe('10')
    expect(flow(toStr, toNum)(42)).toBe(42)
  })
})
