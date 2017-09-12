
import {safe} from 'raid-addons'

export const debug = safe((state, event) => {
  console.log(event, '::', state)
})
