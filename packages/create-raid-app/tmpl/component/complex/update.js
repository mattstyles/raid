
import { safe, compress } from 'raid-addons'

import actions from './actions'

const onAction = safe((state, { value }) => {
  return {
    ...state,
    message: value
  }
})

export const update = compress({
  [actions.onAction]: onAction
})
