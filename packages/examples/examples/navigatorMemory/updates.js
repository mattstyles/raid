
import { debug } from '@raid/addons'

import { signal } from './store'
import { memoryUpdate } from './navigation'

export const register = () => {
  signal.register(debug())
  signal.register(memoryUpdate)
}
