
import React from 'react'

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

export const createRoute = (children, route) => React.Children
  .toArray(children)
  .filter(findRoute(route))
  .map(clone)
