import { describe, expect, test } from 'bun:test'

import { pipe } from './pipe'

const identity = <T>(x: T): T => x

describe('Pipe', () => {
  test('arity', () => {
    expect(pipe(1, identity)).toBe(1)
    expect(pipe(1, identity, identity)).toBe(1)
    expect(pipe(1, identity, identity, identity)).toBe(1)
    expect(pipe(1, identity, identity, identity, identity)).toBe(1)
    expect(pipe(1, identity, identity, identity, identity, identity)).toBe(1)
    expect(
      pipe(1, identity, identity, identity, identity, identity, identity),
    ).toBe(1)
  })

  test('preserves type', () => {
    expect(pipe(1, (x) => x + 1)).toBe(2)
    expect(pipe('foo', (x) => x.length)).toBe(3)
  })

  test('pointed', () => {
    const fn = (x: number) => pipe(x, (x) => x ** 2)

    expect(fn(4)).toBe(16)
  })
})
