
import {Signal} from 'raid/src'
import adaptor from 'raid-addons/src/adaptor'

export const signal = new Signal({
  name: 'Raid',
  count: 0
})

export const connect = adaptor(signal)
