
import React from 'react'
import {compose, filter, map} from 'lodash/fp'

const unpack = arr => arr[0]

const clone = child => {
  return React.cloneElement(child, {
    params: 'foo'
  })
}

// @TODO match with or without /
// @TODO match route params
const findRoute = route => {
  const re = new RegExp(`^${route.pathname}$`)
  return child => re.test(child.props.route)
}

export const createRoute = (children, route) => compose(
  unpack,
  map(clone),
  filter(findRoute(route))
)(React.Children.toArray(children))
