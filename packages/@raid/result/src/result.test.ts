import { describe, expect, test } from 'bun:test'

import { fromThrowable } from './ctor'
import { err, of, ok } from './model'

describe('Match returns values', () => {
  test('Err arm runs on results containing errors', () => {
    const e = err(new Error('oops'))
    expect(e.match(() => 'handled')).toBe('handled')
    expect(
      e.match(
        () => 'handled',
        () => 'nope',
      ),
    ).toBe('handled')
    expect(
      e.match(
        () => {},
        () => {},
      ),
    ).toBe(undefined)
  })

  test('Ok arm matches values', () => {
    expect(ok(42).match(() => 10)).toBe(42)
    expect(
      ok(42).match(
        () => 1,
        () => 2,
      ),
    ).toBe(2)
    expect(
      ok<unknown>('foo').match(
        () => false,
        () => true,
      ),
    ).toBe(true)
  })
})

describe('constructor', () => {
  test('fromThrowable', () => {
    function inverse(x: number) {
      if (x === 0) {
        throw new Error('divide by 0')
      }
      return 1 / x
    }
    expect(fromThrowable(inverse)(10)).toStrictEqual(of(0.1))
    expect(fromThrowable(inverse)(0)).toStrictEqual(
      err(new Error('divide by 0')),
    )
  })
})

describe('map', () => {
  test('Ok', () => {
    expect(of(42).map(() => 'str')).toStrictEqual(ok('str'))
    expect(of(42).map((): unknown => 'str')).toStrictEqual(ok<unknown>('str'))
  })

  test('Err - type is preserved through the map', () => {
    expect(of(new Error('foo')).map(() => 42)).toStrictEqual(
      of<number>(new Error('foo')),
    )
  })

  test('Err - subsequent errors are not collected', () => {
    expect(of(new Error('foo')).map(() => new Error('bar'))).toStrictEqual(
      of<number>(new Error('foo')),
    )
  })
})

describe('flatMap', () => {
  function inverse(x: number) {
    if (x === 0) {
      return err(new Error('divide by 0'))
    }
    return ok(1 / x)
  }
  function withError() {
    return err(new Error('some error'))
  }

  test('some', () => {
    expect(ok(2).flatMap(inverse)).toStrictEqual(ok(0.5))
    expect(ok(0).flatMap(inverse)).toStrictEqual(err(new Error('divide by 0')))
  })
  test('none', () => {
    expect(err(new Error('oops')).flatMap(inverse)).toStrictEqual(
      err(new Error('oops')),
    )
  })

  test('chain', () => {
    const o = ok(0).flatMap(inverse).flatMap(withError)
    expect(o).toStrictEqual(err(new Error('divide by 0')))
  })

  test('ap', () => {
    function inverse(x: number) {
      if (x === 0) {
        throw new Error('divide by 0')
      }
      return 1 / x
    }

    expect(ok(10).ap(ok(inverse))).toStrictEqual(ok(0.1))
    expect(err(new Error('oops')).ap(ok(inverse))).toStrictEqual(
      err(new Error('oops')),
    )

    const applyingError = ok(10)
      .ap(err(new Error('oops')))
      .match(
        (err) => err,
        (v) => v,
      )

    expect(applyingError).toStrictEqual(new Error('oops'))
  })
})
