
import {actions} from './actions'
import {safe, compress} from 'raid-addons'

const KEY = 'navigation'

export const initial = {
  [KEY]: {
    stack: [window.location.pathname],
    index: 0
  }
}

const getNav = state => state[KEY]

const updateNavigate = safe((state, payload) => {
  const {index, stack} = getNav(state)
  stack[index] = payload.route
})

export const update = compress({
  [actions.navigate]: updateNavigate
})
