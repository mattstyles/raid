
import tape from 'tape'
import createHistory from 'history/createMemoryHistory'

import {init} from '../src'

global.window = {}

tape('Should export an init function', t => {
  t.plan(1)

  t.ok(typeof init, 'function', 'Exports an init function')
})
