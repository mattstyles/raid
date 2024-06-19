import { describe, expect, test } from 'bun:test'
import { expectType } from 'tsd'

import { fromThrowable } from './ctor'
import { err, of, ok } from './model'
import type { Result } from './model'

describe('constructor types', () => {
  test('Err', () => {
    expectType<Result<never, Error>>(err(new Error('oops')))
  })
  test('Ok', () => {
    expectType<Result<string, never>>(ok('foo'))
  })
  test('Result', () => {
    expectType<Result<unknown, Error>>(of(new Error('oops')))
    expectType<Result<number, Error>>(of(12))
    expectType<Result<number, Error>>(of<number>(new Error('oops')))
  })

  test('fromThrowable', () => {
    expectType<Result<unknown, Error>>(
      fromThrowable(() => {
        throw new Error('oops')
      })(),
    )
    expectType<Result<number, Error>>(fromThrowable(() => 12)())

    function throwable(d: number): number {
      return 100 / d
    }
    expectType<Result<number, Error>>(fromThrowable(throwable)(12))
    expectType<Result<number, Error>>(fromThrowable(throwable)(0))
    expectType<Result<unknown, Error>>(
      fromThrowable(() => new Error('err returned'))(),
    )

    function inverse(x: number) {
      if (x === 0) {
        throw new Error('divide by 0')
      }
      return 1 / x
    }
    expectType<Result<number, Error>>(fromThrowable(inverse)(0))
  })

  test('Error casting', () => {
    class MyError extends Error {}
    expectType<Result<unknown, MyError>>(of(new MyError()))
  })
})

describe('match::typescript type definitions', () => {
  test('Err case', () => {
    const result = err(new Error('oops'))

    expectType<Result<unknown, Error>>(err(new Error('oops')))

    expectType<string>(result.match(() => 'handled'))
    expectType<string>(
      result.match(
        () => 'handled',
        () => 'never',
      ),
    )

    expectType<string>(
      // @ts-expect-error both clauses should match on the type
      result.match(
        () => 'handled',
        () => 12,
      ),
    )
  })

  test('Result case', () => {
    const result = ok(12)

    expectType<Result<string>>(ok('foo'))

    expectType<number>(result.match(() => 42))
    expectType<number>(
      result.match(
        () => 42,
        () => 0,
      ),
    )

    expectType<number>(
      result.match(
        // @ts-expect-error both clauses should match on type
        () => 'handled',
        () => 12,
      ),
    )
  })

  test('Unknown type can be cast if both clauses are present', () => {
    const result = ok<unknown>(true)

    expectType<unknown>(result.match(() => 12))
    expectType<number>(
      result.match(
        () => 12,
        () => 42,
      ),
    )
    expectType<string>(
      result.match(
        () => 'err',
        () => 'res',
      ),
    )
  })

  test('match does not require a return', () => {
    const result = ok(true)

    expectType<undefined>(
      result.match(
        () => {},
        () => {},
      ),
    )
    // biome-ignore lint/suspicious/noConfusingVoidType: TS returns void for the function return rather than undefined
    expectType<void | boolean>(result.match(() => {}))
  })
})
