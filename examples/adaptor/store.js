
import {Signal} from 'raid'
import {adaptor} from 'raid-addons'

export const signal = new Signal({
  name: 'Raid',
  count: 0
})

export const connect = adaptor(signal)
