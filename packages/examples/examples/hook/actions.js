
import { signal } from './store'

export const actions = {
  changeName: 'change:name',
  changeAge: 'change:age'
}

export const dispatch = type => {
  return event => {
    signal.emit({ type, meta: 'change' })
  }
}
