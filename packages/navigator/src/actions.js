
import {history} from './history'

export const actions = {
  push: 'navigator:push',
  pop: 'navigator:pop',

  // @TODO
  replace: 'navigator:replace'
}

export const dispatcher = (signal, type) =>
  payload => signal.emit({type, payload})

export const back = () => history().goBack()
export const forward = () => history().goForward()
