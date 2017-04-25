
import {Signal} from 'raid/src'
import {initial} from 'raid-navigator/src'
import {adaptor} from 'raid-addons/src'

export const signal = new Signal({
  ...initial
})

export const connect = adaptor(signal)
