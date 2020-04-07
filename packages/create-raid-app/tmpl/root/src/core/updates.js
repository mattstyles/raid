
import { safe } from '@raid/addons'

export const example = safe((state, event) => {
  console.log(event, '::', state)
})
