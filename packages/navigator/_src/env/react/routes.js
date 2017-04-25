
import React from 'react'
import {compose, filter, map, head, defaultTo} from 'lodash/fp'

const clone = child => {
  return React.cloneElement(child, {
    params: 'foo'
  })
}

// @TODO match with or without /
// @TODO match route params
export const findRoute = route => {
  const re = new RegExp(`^${route.pathname}$`)
  return child => re.test(child.props.route)
}

export const matchRoute = (children, route) => compose(
  defaultTo(null),
  head,
  map(clone),
  filter(findRoute(route))
)(React.Children.toArray(children))
