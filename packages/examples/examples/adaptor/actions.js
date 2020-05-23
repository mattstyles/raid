
import { signal } from './store'

export const actions = {
  add: 'actions:add',
  subtract: 'actions:subtract'
}

export const dispatch = type => event => signal.emit({ type })
