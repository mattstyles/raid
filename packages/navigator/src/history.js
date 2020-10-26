
import { createBrowserHistory } from 'history'

var defaultHistory = null

const create = () => {
  defaultHistory = createBrowserHistory()
  return defaultHistory
}

export const getHistory = (history) => {
  return history || defaultHistory || create()
}
