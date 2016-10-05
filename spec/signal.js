
const tape = require('tape')

const {Signal} = require('../lib')

tape('Signals can register and dispose of mutator functions', t => {
  t.plan(3)

  let signal = new Signal()
  let dispose = signal.register(() => {})

  t.equal('function', typeof dispose, 'Register returns a dispose function')
  t.equal(signal.mutators.size, 1,
    'Register adds a function to an internal stack')

  dispose()

  t.equal(signal.mutators.size, 0, 'Dispose removes a function from the stack')
})

tape('Signals can register functions with specific keys', t => {
  t.plan(1)

  let signal = new Signal()
  signal.register(() => {}, 'test')

  t.equal('function', typeof signal.mutators.get('test'),
    'Mutator functions can be referenced by id')
})

tape('Signals constructor applies a default empty object as state', t => {
  t.plan(2)

  let signal = new Signal()
  signal.register((state) => state)
  signal.subscribe(state => {
    t.deepEqual(state, {}, 'State defaults to an empty object')
  })

  let signal2 = new Signal({foo: 'bar'})
  signal2.register((state) => state)
  signal2.subscribe(state => {
    t.deepEqual(state, {foo: 'bar'},
      'State constructor accepts an initial state object')
  })
})

tape.skip('Subscribing to a signal handles errors', t => {
  t.plan(2)

  let signal = new Signal()
  signal.register(state => {
    console.log('throwing error')
    throw new Error()
  })
  signal.subscribe(
    state => {
      console.log('onupdate')
      t.equal(1, 1)
    },
    error => {
      console.log('onerror')
      t.end()
    },
    complete => {
      console.log('oncomplete')
      t.end()
    }
  )

  signal.emit({type: 'action'})
})
