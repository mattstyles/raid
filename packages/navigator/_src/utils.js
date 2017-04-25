
import {findIndex} from 'lodash/fp'

export const findKey = key => findIndex(route => route.key === key)

export const getRouteIndex = (route, stack) => {
  const find = findKey(route.key)
  return find(stack)
}

const getWindowPathname = () => {
  return window && window.location
    ? window.location.pathname
    : '/'
}

const getHistoryState = history => {
  const key = (Math.random() * 1e5 | 0).toString(16)

  if (!history) {
    return {
      state: null,
      key
    }
  }

  if (history.location) {
    return history.location
  }

  if (history.state) {
    const {state, key} = history.state
    return {state, key}
  }

  history.replaceState(Object.assign({},
    history.state,
    {key}
  ), getWindowPathname())

  return {
    state: null,
    key: history.state.key
  }
}

/**
 * Uses window.history and window.location to try to calculate
 * the current route
 */
export const getCurrentRoute = (location, history) => {
  console.log(location, history)
  return location || {
    pathname: getWindowPathname(),
    ...getHistoryState(history || window.history || null)
  }
}
