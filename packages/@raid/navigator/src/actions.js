
import { getHistory } from './history'

export const actions = {
  push: '@navigator:push',
  pop: '@navigator:pop',
  init: '@navigator:init',

  // @TODO
  replace: '@navigator:replace'
}

export const dispatcher = (signal, type) =>
  payload => signal.emit({ type, payload })

export const back = () => getHistory().back()
export const forward = () => getHistory().forward()
export const push = function () {
  return getHistory().push(...arguments)
}
export const go = function () {
  return getHistory().go(...arguments)
}

export const createActions = history => ({
  back: () => getHistory(history).back(),
  forward: () => getHistory(history).forward(),
  push: function () {
    return getHistory(history).push(...arguments)
  },
  go: function () {
    return getHistory(history).go(...arguments)
  }
})
