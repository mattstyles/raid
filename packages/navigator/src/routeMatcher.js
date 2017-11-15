
import {compose} from 'lodash/fp'

import {getProps, wrapChildren} from './utils'
import {DEFAULT_KEY} from './update'

const {matchRoute} = require(`${process.env.BABEL_ENV}/routes.js`)

const RouteMatcher = props => {
  const {children, navigation} = getProps({
    ...props,
    root: DEFAULT_KEY
  })

  if (!navigation) {
    return null
  }

  const {stack, index} = navigation

  if (!stack || !stack.length) {
    return null
  }

  return compose(
    wrapChildren,
    matchRoute(stack[index])
  )(children)
}

export default RouteMatcher
