import { describe, expect, test } from 'bun:test'
import { expectType } from 'tsd'

import { fromNullable, option } from './ctor'
import type { Option } from './option'

describe('constructor types', () => {
  test('option', () => {
    expectType<Option<never>>(option(null))
    expectType<Option<string>>(option('str'))
    expectType<Option<boolean>>(option(true))

    // @ts-expect-error value type does not match passed type
    option<string>(12)
  })

  test('fromNullable', () => {
    expectType<Option<never>>(fromNullable(() => null)())
    expectType<Option<string>>(fromNullable(() => 'str')())
    expectType<Option<boolean>>(fromNullable(() => true)())
  })
})

describe('match::typescript type definitions', () => {
  test('None case must be handled', () => {
    const none = option(undefined)

    expect(() => {
      // @ts-expect-error
      const value = none.match()
    }).toThrow()
  })

  test('None case matching', () => {
    const none = option(null)

    expectType<Option<never>>(none)
    expectType<string>(none.match(() => 'foo'))
    expectType<number>(
      none.match(
        () => 1,
        () => 2,
      ),
    )
    none.match(
      () => 1,
      // @ts-expect-error types should always match
      () => 'foo',
    )
  })

  // If the type is not known then the type will be preserved unless both arms return a value
  test('Unknown case matching', () => {
    const opt = option<unknown>('foo')

    expectType<Option<unknown>>(opt)
    expectType<unknown>(opt.match(() => 12)) // could be string, but could be unknown

    // must be boolean as one of the arms will return a value and that value must match
    expectType<boolean>(
      opt.match(
        () => false,
        () => true,
      ),
    )

    opt.match(
      () => 1,
      // @ts-expect-error return types must match each other even in unknown case
      () => 'foo',
    )
  })

  // If the type is a known type then it should be preserved via match
  test('Known type case matching', () => {
    const str = option('foo')

    expectType<Option<string>>(str)
    expectType<string>(str.match(() => 'foo'))

    // @ts-expect-error match is not a type mapper
    str.match(() => 42)
    str.match(
      // @ts-expect-error match is not a type mapper
      () => 0,
      () => 1,
    )
    str.match(
      () => 'foo',
      // @ts-expect-error match is not a type mapper
      () => 1,
    )
    str.match(
      // @ts-expect-error match is not a type mapper
      () => 12,
      () => 'bar',
    )
    str.match(
      // @ts-expect-error type is known and return should match a known type
      () => false,
      () => true,
    )
  })

  test('onSome arm is optional', () => {
    expectType<number>(option(42).match(() => 1))
    expectType<number>(
      option(42).match(
        () => 1,
        () => 2,
      ),
    )
    expectType<unknown>(option<unknown>(42).match(() => 1))
    expectType<boolean>(option(null).match(() => true))
  })

  test('match does not require a return type', () => {
    expectType<undefined>(
      option(42).match(
        () => {},
        () => {},
      ),
    )
    // biome-ignore lint/suspicious/noConfusingVoidType: typing will return the void in a union here in place of an undefined due to how TS models function return
    expectType<number | void>(option(42).match(() => {}))
  })
})
