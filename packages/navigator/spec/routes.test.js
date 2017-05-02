
import './setup'

import tape from 'tape'

import {findRoute, matchRoute} from '../src/env/react/routes'

tape('Match a child from a route', t => {
  t.plan(2)

  const route = {
    pathname: 'foo'
  }
  const match = {
    props: {
      route: 'foo'
    }
  }
  const noMatch = {
    props: {
      route: 'bar'
    }
  }

  const find = findRoute(route)
  t.ok(find(match), 'Finds a child via route props')
  t.notOk(find(noMatch), 'Returns false when child does not match')
})

tape('Match finds a child from a list', t => {
  t.plan(6)

  const createChild = route => <div route={route} id={route} />

  const route = {
    pathname: 'foo'
  }
  const matchFooRoute = matchRoute(route)

  const search = [
    createChild('foo'),
    createChild('bar')
  ]
  const match = matchFooRoute(search)[0]
  t.ok(match, 'Finds a child')
  t.equal(match.props.id, 'foo', 'Finds the correct child at the head of a list')

  const search2 = [
    createChild('bar'),
    createChild('foo')
  ]
  const match2 = matchFooRoute(search2)[0]
  t.ok(match2, 'Finds a child')
  t.equal(match2.props.id, 'foo', 'Finds the correct child at the tail of a list')

  const search3 = [
    createChild('bar'),
    createChild('foo'),
    createChild('quux'),
    createChild('baz')
  ]
  const match3 = matchFooRoute(search3)[0]
  t.ok(match3, 'Finds a child')
  t.equal(match3.props.id, 'foo', 'Finds the correct child from the middle of a list')
})

tape('Match is able to match multiple children', t => {
  t.plan(2)

  const createChild = route => <div route={route} id={route} />

  const route = {
    pathname: 'foo'
  }
  const matchFooRoute = matchRoute(route)

  const search = [
    createChild('foo'),
    createChild('bar'),
    createChild('foo')
  ]

  const match = matchFooRoute(search)
  t.ok(match, 'Finds children')
  t.equal(match.length, 2, 'Finds multiple children')
})

tape('Match fails to find a child', t => {
  t.plan(1)

  const createChild = route => <div route={route} id={route} />

  const route = {
    pathname: 'baz'
  }

  const search = [
    createChild('foo'),
    createChild('bar')
  ]
  const match = matchRoute(route)(search)
  t.deepEqual(match, [], 'Match returns an empty array if not found')
})

tape('Children get params appended as properties', t => {
  t.plan(1)

  const child = <div route='/foo/:id' />
  const route = {pathname: '/foo/123'}

  const match = matchRoute(route)([child])

  console.log(match)

  t.ok()
})
