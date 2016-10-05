
const tape = require('tape')

const {Signal} = require('../lib')

tape('Signals can register and dispose of mutator functions', t => {
  t.plan(3)

  let signal = new Signal()
  let dispose = signal.register(() => {})

  t.equal('function', typeof dispose, 'Register returns a dispose function')
  t.equal(1, signal.mutators.size,
    'Register adds a function to an internal stack')

  dispose()

  t.equal(0, signal.mutators.size, 'Dispose removes a function from the stack')
})

tape('Signals can register functions with specific keys', t => {
  t.plan(1)

  let signal = new Signal()
  signal.register(() => {}, 'test')

  t.equal('function', typeof signal.mutators.get('test'),
    'Mutator functions can be referenced by id')
})
