
import { signal } from './store'

export const actions = {
  request: 'request',
  requestPending: 'request:pending',
  requestSuccess: 'request:success',
  requestFailure: 'request:failure'
}

export const dispatch = type =>
  payload => signal.emit({ type, payload })
