
import {actions} from './actions'
import {safe, compress} from 'raid-addons'

const KEY = 'navigation'

export const initial = {
  [KEY]: {
    route: null
  }
}

const updateNavigate = safe((state, payload) => {
  state[KEY].route = payload.route
})

export const update = compress({
  [actions.navigate]: updateNavigate
})
