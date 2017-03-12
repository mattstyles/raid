
import {Signal} from 'raid'
import adaptor from '../../src/adaptor'

export const signal = new Signal({
  name: 'Raid',
  count: 0
})

export const connect = adaptor(signal)
