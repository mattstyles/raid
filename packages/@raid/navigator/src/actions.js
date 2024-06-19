import { getHistory } from './history'

export const actions = {
  push: '@navigator:push',
  pop: '@navigator:pop',
  init: '@navigator:init',

  // @TODO
  replace: '@navigator:replace',
}

export const dispatcher = (signal, type) => (payload) =>
  signal.emit({ type, payload })

export const back = () => getHistory().back()
export const forward = () => getHistory().forward()
export function push(...args) {
  return getHistory().push(...args)
}
export function go(...args) {
  return getHistory().go(...args)
}

export const createActions = (history) => ({
  back: () => getHistory(history).back(),
  forward: () => getHistory(history).forward(),
  push: function push(...args) {
    return getHistory(history).push(...args)
  },
  go: function go(...args) {
    return getHistory(history).go(...args)
  },
})
