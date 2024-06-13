import {describe, expect, test} from 'bun:test'
import {expectType} from 'tsd'

import type {Option} from './option'
import {fromNullable} from './ctor'


describe('match::typescript type definitions', () => {
  test('None case must be handled', () => {
    const none = fromNullable(undefined)
    
    expect(() => {
      // @ts-expect-error
      const value = none.match()
    }).toThrow()
    
  })

  test('None case matching', () => {
    const none = fromNullable(null)
    
    expectType<Option<never>>(none)
    expectType<string>(none.match(() => 'foo'))
    expectType<number>(none.match(() => 1, () => 2))
    // @ts-expect-error
    none.match(() => 1, () => 'foo') // types do not match
  })

  // If the type is not known then the type will be preserved unless both arms return a value
  test('Unknown case matching', () => {
    const opt = fromNullable<unknown>('foo')

    expectType<Option<unknown>>(opt)
    expectType<unknown>(opt.match(() => 12)) // could be string, but could be unknown
    expectType<boolean>(opt.match(() => false, () => true)) // must be string as one of the arms will return a value and that value must match

    // @ts-expect-error return types must match each other even in unknown case
    opt.match(() => 1, () => 'foo')
  })

  // If the type is a known type then it should be preserved via match
  test('Known type case matching', () => {
    const str = fromNullable('foo')

    expectType<Option<string>>(str)
    expectType<string>(str.match(() => 'foo'))
    
    // @ts-expect-error match is not a type mapper
    str.match(() => 42)
    // @ts-expect-error match is not a type mapper
    str.match(() => 0, () => 1)
    // @ts-expect-error match is not a type mapper
    str.match(() => 'foo', () => 1)
    // @ts-expect-error match is not a type mapper
    str.match(() => 12, () => 'bar')
    // @ts-expect-error type is known and return should match a known type
    str.match(() => false, () => true)
  })

  test('onSome arm is optional', () => {
    expectType<number>(fromNullable(42).match(() => 1))
    expectType<number>(fromNullable(42).match(() => 1, () => 2))
    expectType<unknown>(fromNullable<unknown>(42).match(() => 1))
    expectType<boolean>(fromNullable(null).match(() => true))
  })

  test('match does not require a return type', () => {
    expectType<undefined>(fromNullable(42).match(() => {}, () => {}))
    // biome-ignore lint/suspicious/noConfusingVoidType: typing will return the void in a union here in place of an undefined due to how TS models function return
    expectType<number | void>(fromNullable(42).match(() => {}))
  })
})