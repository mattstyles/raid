
import { compose } from 'lodash/fp'

import { getProps, wrapChildren } from './utils'
import { DEFAULT_KEY } from './update'

// const {matchRoute} = require(`${process.env.BABEL_ENV}/routes.js`)
// const {mapChildren: mapChilds} = require(`${process.env.BABEL_ENV}/component.js`)

import { matchRoute } from './env/react/routes'
import { mapChildren as mapChilds } from './env/react/component'

const RouteMatcher = props => {
  const { children, navigation } = getProps({
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
  const childs = mapChildren
    ? mapChilds(children, mapChildren)
    : children

  return compose(
    wrapChildren,
    matchRoute(stack[index])
  )(childs)
}

export default RouteMatcher
