
import { Signal } from 'raid'
import { initial } from '@raid/navigator'
import { adaptor } from '@raid/addons/adaptor'

export const signal = new Signal({
  ...initial
})

export const connect = adaptor(signal)
