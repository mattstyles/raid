import { describe, expect, test } from 'bun:test'
import { flow } from '@raid/flow'

import { fromThrowable } from './ctor'
import { err, of, ok } from './model'
import { flatMap, map, match } from './result'

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

    expect(fromThrowable(() => new Error('oops'))()).toStrictEqual(
      err(new Error('oops')),
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

  test('catch', () => {
    function inverse(x: number) {
      if (x === 0) {
        throw new Error('divide by 0')
      }
      return 1 / x
    }

    expect(ok(0).map(inverse)).toStrictEqual(err(new Error('divide by 0')))
    expect(ok(5).map(inverse)).toStrictEqual(ok(0.2))
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
  function throwError(x: number) {
    if (x === 0) {
      throw new Error('thrown')
    }
    return ok(x)
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

  test('catch', () => {
    const o = ok(0).flatMap(inverse).flatMap(throwError)
    expect(o).toStrictEqual(err(new Error('divide by 0')))

    const o2 = ok(0).flatMap(throwError)
    expect(o2).toStrictEqual(err(new Error('thrown')))
  })
})

describe('ap', () => {
  test('catch', () => {
    function inverse(x: number) {
      if (x === 0) {
        throw new Error('divide by 0')
      }
      return 1 / x
    }

    expect(ok(10).ap(ok(inverse))).toStrictEqual(ok(0.1))
    expect(ok(0).ap(ok(inverse))).toStrictEqual(err(new Error('divide by 0')))
    expect(err(new Error('oops')).ap(ok(inverse))).toStrictEqual(
      err(new Error('oops')),
    )
  })

  test('err', () => {
    const applyingError = ok(10)
      .ap(err(new Error('oops')))
      .match(
        (err) => err,
        (v) => v,
      )

    expect(applyingError).toStrictEqual(new Error('oops'))
  })
})

describe('orElse', () => {
  test('return', () => {
    expect(ok(20).orElse(4)).toBe(20)
    expect(err(new Error('oops')).orElse(42)).toBe(42)
  })
})

describe('Result::map', () => {
  const double = (x: number) => x * 2
  const inverse = (x: number) => {
    if (x === 0) {
      throw new Error('divide by 0')
    }
    return 1 / x
  }

  test('result', () => {
    expect(map(double)(ok(10))).toStrictEqual(ok(20))
    expect(map(double)(err(new Error('oops')))).toStrictEqual(
      err(new Error('oops')),
    )
  })

  test('type', () => {
    expect(map((x: number) => 'ok')(ok(12))).toStrictEqual(ok('ok'))
  })

  test('catch', () => {
    expect(map(inverse)(ok(1))).toStrictEqual(ok(1))
    expect(map(inverse)(ok(0))).toStrictEqual(err(new Error('divide by 0')))
    expect(map(inverse)(err(new Error('oops')))).toStrictEqual(
      err(new Error('oops')),
    )
  })

  test('flow', () => {
    const seq = flow(map(double), map(inverse))

    expect(seq(ok(2))).toStrictEqual(ok(0.25))
    expect(seq(ok(0))).toStrictEqual(err(new Error('divide by 0')))
    expect(seq(err(new Error('oops')))).toStrictEqual(err(new Error('oops')))
  })
})

describe('Result::flatMap', () => {
  const len = (x: string) => {
    if (x.length < 1) {
      return err(new Error('short'))
    }
    return ok(x.length)
  }
  const thrower = (x: number) => {
    if (x < 5) {
      throw new Error('throw')
    }
    return ok('ok')
  }

  test('result', () => {
    expect(flatMap(len)(ok('foo'))).toStrictEqual(ok(3))
    expect(flatMap(len)(ok(''))).toStrictEqual(err(new Error('short')))
  })

  test('error passthrough', () => {
    expect(flatMap(len)(err(new Error('oops')))).toStrictEqual(
      err(new Error('oops')),
    )
  })

  test('catch', () => {
    expect(flatMap(thrower)(ok(10))).toStrictEqual(ok('ok'))
    expect(flatMap(thrower)(err(new Error('oops')))).toStrictEqual(
      err(new Error('oops')),
    )
    expect(flatMap(thrower)(ok(2))).toStrictEqual(err(new Error('throw')))
  })

  test('flow', () => {
    const seq = flow(flatMap(len), flatMap(thrower))

    expect(seq(ok('foo'))).toStrictEqual(err(new Error('throw')))
    expect(seq(ok(''))).toStrictEqual(err(new Error('short')))
    expect(seq(err(new Error('oops')))).toStrictEqual(err(new Error('oops')))
    expect(seq(ok('foobarbaz'))).toStrictEqual(ok('ok'))
  })
})

describe('Result::match', () => {
  test('preserves type', () => {
    const pre = match(
      () => 'oops',
      (v: string) => `.${v}`,
    )

    expect(pre(ok('foo'))).toBe('.foo')
    expect(pre(err(new Error('foo')))).toBe('oops')

    // @ts-expect-error type mismatch
    pre(ok(10))
  })

  test('passthrough', () => {
    expect(match(() => false)(ok(true))).toBe(true)
    expect(match(() => false)(err(new Error('oops')))).toBe(false)
  })

  test('handles unknown', () => {
    const truthy = match<unknown>(
      () => false,
      () => true,
    )
    expect(truthy(of<unknown>('foo'))).toBeTruthy()
    expect(truthy(of<unknown>(new Error('oops')))).toBeFalsy()
  })

  test('flow', () => {
    const bounds = (x: number) =>
      x > 0 && x < 10 ? ok(x) : err(new Error('out of bounds'))
    const seq = flow(
      flatMap(bounds),
      match(() => -1),
    )

    expect(seq(ok(20))).toBe(-1)
    expect(seq(ok(4))).toBe(4)
    expect(seq(ok(-23))).toBe(-1)
  })
})

// @TODO describe flatmap
// @TODO describe match
// @TODO describe orElse
