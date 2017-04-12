
import './setup'

import tape from 'tape'
import createHistory from 'history/createMemoryHistory'
import {Signal} from 'raid'

import {getHistory, createListener} from '../src/history'
import {actions} from '../src/actions'

tape('getHistory should return a passed history function', t => {
  t.plan(1)

  const history = createHistory()
  t.equal(getHistory(history), history, 'History is returned')
})

tape('getHistory should persist a default history', t => {
  t.plan(1)

  const def = getHistory()
  const return2 = getHistory()

  t.equal(def, return2, 'Default history is used')
})

tape('listeners should be attached to histories', t => {
  t.plan(2)

  t.equal(typeof createListener, 'function', 'create listener is a function')
  t.equal(typeof createListener(), 'function', 'function is created to attach')
})

tape('Changing location triggers the signal', t => {
  t.plan(2)

  let signal = new Signal({})
  let trigger = createListener(signal)

  signal.register((state, event) => {
    if (event.type === actions.pop) {
      t.equal(event.payload.location, 'popper', 'Pop event is triggered')
    }

    if (event.type === actions.push) {
      t.equal(event.payload.location, 'pusher', 'Push event is triggered')
    }
  })

  trigger('popper', 'POP')
  trigger('pusher', 'PUSH')
})
