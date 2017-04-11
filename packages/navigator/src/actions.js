
import {getHistory} from './history'

export const actions = {
  push: 'navigator:push',
  pop: 'navigator:pop',

  // @TODO
  replace: 'navigator:replace'
}

export const dispatcher = (signal, type) =>
  payload => signal.emit({type, payload})

export const back = () => getHistory().goBack()
export const forward = () => getHistory().goForward()
