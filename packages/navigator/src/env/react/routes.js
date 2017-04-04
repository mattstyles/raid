
import React from 'react'

const clone = child => {
  return React.cloneElement(child, {
    params: 'foo'
  })
}

const findRoute = route => {
  const re = new RegExp(route)
  return child => re.test(child.props.route)
}

export const createRoute = (children, route) => React.Children
  .toArray(children)
  .filter(findRoute(route))
  .map(clone)
