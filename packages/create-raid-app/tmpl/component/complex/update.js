
import {safe, compress} from 'raid-addons'

import actions from './actions'

const onAction = safe((state, {value}) => {
  state.message = value
})

export default compress({
  [actions.onAction]: onAction
})
