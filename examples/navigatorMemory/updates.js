
import { safe } from 'raid-addons'

import { signal } from './store'
import { memoryUpdate } from './navigation'

export const register = () => {
  signal.register(safe((state, event) => {
    console.log('-- signal --', state, event)
  }))
  signal.register(memoryUpdate)
}
