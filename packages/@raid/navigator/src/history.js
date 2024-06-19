import { createBrowserHistory } from 'history'

let defaultHistory = null

const create = () => {
  defaultHistory = createBrowserHistory()
  return defaultHistory
}

export const getHistory = (history) => {
  return history || defaultHistory || create()
}
