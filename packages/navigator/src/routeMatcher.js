
import { getProps, wrapChildren } from './utils'
import { DEFAULT_KEY } from './update'

import { matchRoute } from './env/react/routes'
import { mapChildren as mapChilds } from './env/react/component'

export const RouteMatcher = props => {
  const { children: propChildren, navigation } = getProps({
    ...props,
    root: DEFAULT_KEY
  })

  const { mapChildren } = props

  if (!navigation) {
    return null
  }

  const { stack, index } = navigation

  if (!stack || !stack.length) {
    return null
  }

  // Invoke the mapper if available
  const children = mapChildren
    ? mapChilds(propChildren, mapChildren)
    : propChildren

  const matcher = matchRoute(stack[index])
  const route = matcher(children)
  return wrapChildren(route)
}
