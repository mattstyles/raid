
import './setup'

import tape from 'tape'
import { createMemoryHistory } from 'history'
import { Signal } from 'raid'

import { createListener } from '../src/listener'
import { getHistory } from '../src/history'
import { actions } from '../src/actions'

tape('getHistory should return a passed history function', t => {
  t.plan(1)

  const history = createMemoryHistory()
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

  const signal = new Signal({})
  const trigger = createListener(signal)

  signal.register((state, event) => {
    if (event.type === actions.pop) {
      t.equal(event.payload.location, 'popper', 'Pop event is triggered')
    }

    if (event.type === actions.push) {
      t.equal(event.payload.location, 'pusher', 'Push event is triggered')
    }
  })

  trigger({ location: 'popper', action: 'POP' })
  trigger({ location: 'pusher', action: 'PUSH' })
})
