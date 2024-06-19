import React from 'react'

const clone = ({ child, params }) => {
  return React.cloneElement(child, {
    params,
  })
}

export const findRoute = (route) => {
  const search = route.pathname.split('/')

  return (child) => {
    const match = child.props.route.split('/')

    // Quick length fail (allow starred routes to proceed)
    if (match.length !== search.length && !match.includes('*')) {
      return false
    }

    return match.reduce(
      (props, param, index) => {
        const { params, result } = props
        const routeParam = search[index]

        if (result === false) {
          return props
        }

        // Match on a starred route
        if (/\*/.test(param)) {
          return props
        }

        // Match on a route parameter
        if (/^:/.test(param)) {
          params[param.replace(/^:/, '')] = routeParam
          return {
            // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
            ...props,
            params,
          }
        }

        // Match on url segment match
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...props,
          result: param === routeParam,
        }
      },
      {
        result: true,
        params: {},
        child,
      },
    )
  }
}

/**
 * Returns an array of children whose parameters match the current route
 */
export const matchRoute = (route) => (children) => {
  const childrenArr = React.Children.toArray(children)
  const output = []
  const find = findRoute(route)
  // biome-ignore lint/complexity/noForEach: <explanation>
  childrenArr.forEach((child) => {
    const found = find(child)
    if (found.result) {
      output.push(clone(found))
    }
  })

  return output
}
