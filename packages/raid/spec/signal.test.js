
const tape = require('tape')

const { Signal } = require('../src')

tape('Signals can register and dispose of mutator functions', t => {
  t.plan(3)

  let signal = new Signal()
  let dispose = signal.register(() => {})

  t.equal('function', typeof dispose, 'Register returns a dispose function')
  t.equal(signal.updates.size, 1,
    'Register adds a function to an internal stack')

  dispose()

  t.equal(signal.updates.size, 0, 'Dispose removes a function from the stack')
})

tape('Signal updates can be disposed by key', t => {
  t.plan(2)

  let signal = new Signal()
  signal.register(() => {}, 'mut')

  t.equal(signal.updates.size, 1, 'Initial mutator map size is ok')

  signal.dispose('mut')

  t.equal(signal.updates.size, 0, 'Dispose removes a specific mutator')
})

tape('Signals can register functions with specific keys', t => {
  t.plan(1)

  let signal = new Signal()
  signal.register(() => {}, 'test')

  t.equal(typeof signal.updates.get('test'), 'function',
    'Mutator functions can be referenced by id')
})

tape('Observers must be supplied to observe/subscribe', t => {
  t.plan(2)

  let signal = new Signal()
  t.throws(() => {
    signal.observe()
  }, 'Supplying no argument to observe/subscribe throws an error')
  t.throws(() => {
    signal.observe({})
  }, 'Supplying no observer to the object form of subscription throws an error')
})

tape('Signals emit an initial event when an observer is connected', t => {
  t.plan(2)

  let initialState = { foo: 'bar' }
  let signal = new Signal(initialState)
  signal.observe(state => {
    t.deepEqual(state, initialState, 'Initial observer is triggered')
  })
  signal.observe({
    next: state => {
      t.deepEqual(state, initialState, 'Initial object-form observable is triggered')
    }
  })
})

tape('Signals constructor applies a default empty object as state', t => {
  t.plan(2)

  let signal = new Signal()
  signal.register((state) => state)
  signal.observe(state => {
    t.deepEqual(state, {}, 'State defaults to an empty object')
  })

  let signal2 = new Signal({ foo: 'bar' })
  signal2.register((state) => state)
  signal2.observe(state => {
    t.deepEqual(state, { foo: 'bar' },
      'State constructor accepts an initial state object')
  })
})

tape('Signal observation triggers so the consumer can use initial state', t => {
  t.plan(1)

  let initial = { foo: 'bar' }
  let signal = new Signal(initial)
  signal.observe(state => {
    t.equal(state, initial, 'Initial state is consumed')
  })
})

tape('Emitting actions triggers updates to fire', t => {
  t.plan(1)

  let count = 0
  let signal = new Signal()
  signal.register(state => {
    count++
    if (count !== 0) {
      t.equal(count, 1, 'Signal has fired')
    }
    return state
  })

  signal.observe(() => {})

  signal.emit({ type: 'action' })
})

tape('State and triggering event are both passed through to the mutator', t => {
  t.plan(3)

  let initial = { foo: 'bar' }
  let signal = new Signal(initial)
  signal.register((state, event) => {
    t.equal(typeof event, 'object', 'Action event should always be an object')
    t.equal(state, initial, 'Current state is passed to the mutator')
    t.deepEqual(event, {
      type: 'action',
      payload: 'foo'
    }, 'Event is of the correct form')
  })

  signal.observe(() => {})
  signal.emit({ type: 'action', payload: 'foo' })
})

tape('Fold traverses the mutator map', t => {
  t.plan(1)

  let initial = { foo: 'bar' }
  let signal = new Signal(initial)
  signal.register(state => {
    state.bar = 'quux'
    return state
  })
  signal.register(state => {
    t.deepEqual(state, {
      foo: 'bar',
      bar: 'quux'
    }, 'State passes from mutator to mutator')
  })

  signal.observe(() => {})
  signal.emit({})
})

tape('Actions to be emitted must be objects', t => {
  t.plan(1)

  let signal = new Signal()

  signal.observe(() => {})

  t.throws(() => {
    signal.emit('action string')
  }, 'Emitting a string throws an error')
})

tape('Multiple actions can be emitted and fulfilled in the same tick', t => {
  t.plan(1)
  let count = 0

  let signal = new Signal({ foo: 'bar' })
  signal.register(state => state)
  signal.observe(state => {
    if (++count === 3) {
      t.pass('Observe has been called the correct number of times')
    }
  })

  signal.emit({})
  signal.emit({})
})
tape('Multiple actions can be emitted and fulfilled in the same tick', t => {
  t.plan(1)

  let signal = new Signal({ foo: 'bar' })
  signal.register((state, event) => {
    if (event.type === 'one') {
      state.one = true
      return state
    }
    if (event.type === 'two') {
      state.two = true
      t.deepEqual(state, {
        foo: 'bar',
        one: true,
        two: true
      })
      return state
    }
  })
  signal.observe(state => {})

  signal.emit({ type: 'one' })
  signal.emit({ type: 'two' })
})
tape('Updates can trigger actions', t => {
  t.plan(1)

  let signal = new Signal({ foo: 'bar' })
  signal.register((state, event) => {
    if (event.type === 'one') {
      signal.emit({ type: 'two' })
    }
    if (event.type === 'two') {
      t.pass('Signal has been emitted and received')
    }
    return state
  })
  signal.observe(() => {})
  signal.emit({ type: 'one' })
})
tape('Actions triggered by update functions mutate state correctly', t => {
  t.plan(2)

  let count = 0
  let signal = new Signal()
  signal.register((state, event) => {
    if (event.type === 'one') {
      state.one = 'one'
      signal.emit({ type: 'two' })
      return state
    }
    if (event.type === 'two') {
      state.two = 'two'
      return state
    }
  })
  signal.observe(state => {
    ++count
    if (count < 2) {
      return
    }

    if (count === 2) {
      t.deepEqual(state, {
        one: 'one'
      }, 'First update mutates state and triggers observable')
      return
    }

    t.deepEqual(state, {
      one: 'one',
      two: 'two'
    }, 'Second update mutates state and triggers observable')
  })
  signal.emit({ type: 'one' })
})

tape('Signals with multiple observers still fire update functions once per event', t => {
  t.plan(1)

  let signal = new Signal({ foo: 'bar' })
  signal.register((state, event) => {
    t.pass('Triggered once')
    return state
  })
  signal.observe(() => {})
  signal.observe(() => {})
  signal.emit({ type: 'update' })
})

tape('Signals should emit errors', t => {
  t.plan(1)

  const ERR = 'update error'
  let signal = new Signal({ foo: 'bar' })
  signal.register((state, event) => {
    throw new Error(ERR)
  })
  signal.observe(
    () => {},
    err => t.equal(err.message, ERR, 'Error is propagated to handler')
  )
  signal.emit({})
})

tape('Signals can dispose of functions', t => {
  t.plan(2)

  let signal = new Signal({})
  let update = (state, event) => {}
  signal.register(update)

  t.equal(signal.updates.size, 1, 'An update is registered')

  signal.disposeAll()
  t.equal(signal.updates.size, 0, 'Disposes of a single function')
})

tape('Signals can dispose of all of their functions', t => {
  t.plan(2)

  let signal = new Signal({})
  let update = (state, event) => {}
  let update2 = (state, event) => {}
  signal.register(update)
  signal.register(update2)

  t.equal(signal.updates.size, 2, 'Updates are registered')

  signal.disposeAll()
  t.equal(signal.updates.size, 0, 'Disposes of all functions')
})

tape('Signals can dispose of a single update with disposeAll', t => {
  t.plan(2)

  let signal = new Signal({})
  let update = (state, event) => {}
  signal.register(update)

  t.equal(signal.updates.size, 1, 'A single update is registered')

  signal.disposeAll()
  t.equal(signal.updates.size, 0, 'Disposed of a single update function')
})

tape('Signals can be created using the of instance method', t => {
  t.plan(1)

  t.ok(Signal.of({}) instanceof Signal, 'creates an instance')
})
