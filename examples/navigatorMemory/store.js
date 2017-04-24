
import {Signal} from 'raid/src'
// import {initial} from 'raid-navigator/src'
import {setInitial} from 'raid-navigator/src'
import {adaptor} from 'raid-addons/src'

import {history} from './history'
// import {initial} from './navigation'

export const signal = new Signal({
  ...setInitial({history})
})

export const connect = adaptor(signal)
