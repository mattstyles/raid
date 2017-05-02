
import React from 'react'
import {compose, filter, map, defaultTo} from 'lodash/fp'

const clone = ({child, params}) => {
  return React.cloneElement(child, {
    params
  })
}

export const findRoute = route => {
  const search = route.pathname.split('/')

  return child => {
    const match = child.props.route.split('/')

    // Quick length fail
    if (match.length !== search.length) {
      return false
    }

    return match.reduce((props, param, index) => {
      const {params, result} = props
      const routeParam = search[index]

      if (result === false) {
        return props
      }

      // Match on a route parameter
      if (/^:/.test(param)) {
        params[param.replace(/^:/, '')] = routeParam
        return {
          ...props,
          params
        }
      }

      // Match on url segment match
      return {
        ...props,
        result: param === routeParam
      }
    }, {
      result: true,
      params: {},
      child
    })
  }
}

export const matchRoute = route => children => compose(
  defaultTo(null),
  map(clone),
  filter(({result}) => result),
  map(findRoute(route))
)(React.Children.toArray(children))
