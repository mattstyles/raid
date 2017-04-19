
import {findIndex} from 'lodash/fp'

export const findKey = key => findIndex(route => route.key === key)

export const getRouteIndex = (route, stack) => {
  const find = findKey(route.key)
  return find(stack)
}

const getHistoryState = history => {
  if (history.state) {
    const {state, key} = history.state
    return {state, key}
  }

  history.replaceState(Object.assign({},
    history.state,
    {key: (Math.random() * 1e5 | 0).toString(16)}
  ), window.location.pathname)

  return {
    state: null,
    key: history.state.key
  }
}

/**
 * Uses window.history and window.location to try to calculate
 * the current route
 */
export const getCurrentRoute = () => {
  return {
    pathname: window.location.pathname,
    ...getHistoryState(window.history)
  }
}
