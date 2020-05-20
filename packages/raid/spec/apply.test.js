
import tape from 'tape'

import { Signal } from '../src'

const identity = _ => _

tape('Apply should add an applicator', t => {
  t.plan(1)

  const signal = Signal.of({})
  signal.apply(identity)

  t.equal(signal.applicators.size, 1,
    'Apply adds a function to an internal stack')
})

tape('Apply should throw if no applicator is supplied', t => {
  t.plan(2)

  const signal = Signal.of({})

  t.throws(() => {
    signal.apply()
  }, 'Supplying no argument to apply throws')

  t.throws(() => {
    signal.apply('will throw')
  }, 'Supplying no function to apply throws')
})

tape('Apply::remove should remove a keyed applicator function', t => {
  t.plan(2)

  const key = 'apply'
  const signal = Signal.of({})
  signal.apply(identity, {
    key: key
  })

  t.equal(signal.applicators.size, 1,
    'Apply adds a function to an internal stack')

  signal.remove(key)
  t.equal(signal.applicators.size, 0,
    'Apply::remove removes a function from an internal stack')
})

tape('Apply returns a function to remove an applicator function', t => {
  t.plan(2)

  const key = 'apply'
  const signal = Signal.of({})
  const remove = signal.apply(identity, {
    key: key
  })

  t.equal(signal.applicators.size, 1,
    'Apply adds a function to an internal stack')

  remove()
  t.equal(signal.applicators.size, 0,
    'Returned function removes a function from an internal stack')
})

tape('Apply::removeAll should remove all applicator functions', t => {
  t.plan(2)

  const signal = Signal.of({})
  signal.apply(identity, {
    key: 'apply1'
  })
  signal.apply(identity, {
    key: 'apply2'
  })

  t.equal(signal.applicators.size, 2,
    'Apply adds a function to an internal stack')

  signal.removeAll()
  t.equal(signal.applicators.size, 0,
    'removeAll removes all applicator function from an internal stack')
})

tape('Apply should wrap each update function', t => {
  t.plan(1)

  const signal = Signal.of({})
  const applicator = fn => {
    t.pass('Applicator is called')
    return (state, event) => fn(state, event) || state
  }
  signal.apply(applicator)
  setTimeout(() => {
    signal.register(identity)
    signal.emit({})
  }, 10)
})

tape('Apply is lazy and evaluates for all updates (old and new)', t => {
  t.plan(2)

  const signal = Signal.of({})
  const applicator = fn => {
    t.pass('Applicator is called')
    return (state, event) => fn(state, event) || state
  }
  signal.apply(applicator)
  setTimeout(() => {
    signal.register(identity)

    setTimeout(() => {
      signal.apply(applicator)
      signal.emit({})
    }, 10)
  }, 10)
})

tape('Remove should ensure no applicators are still applied', t => {
  t.plan(3)

  const signal = Signal.of({})
  const applicator = fn => {
    t.pass('Applicator is called')
    return (state, event) => fn(state, event) || state
  }
  const update = () => {
    t.pass('Update is called')
  }
  const remove = signal.apply(applicator)
  signal.register(update)
  signal.emit({})

  setTimeout(() => {
    remove()
    signal.emit({})
  }, 10)
})

tape('Apply can decorate the state for each update function', t => {
  t.plan(1)

  const original = 'original'
  const applied = 'applied'
  const expected = {
    original,
    applied
  }
  const stack = []
  const signal = Signal.of({})
  signal.apply(fn => (state, event) => {
    return fn({
      ...state,
      applied
    }, event)
  })
  signal.register((state, event) => {
    return {
      ...state,
      original
    }
  })

  signal.observe(state => {
    stack.push(state)
  })
  signal.emit({})

  setTimeout(() => {
    signal.observe(() => {
      t.deepEqual(stack, [
        {},
        expected
      ], 'Apply and updates can change the state')
    })
  }, 10)
})

tape('Apply can decorate the event for each update function', t => {
  t.plan(1)

  const event = {
    type: 'test'
  }
  const decorated = {
    payload: 'merged'
  }
  const expected = {
    ...event,
    ...decorated
  }
  const signal = Signal.of({})
  signal.apply(fn => (state, event) => {
    return fn(state, {
      ...event,
      ...decorated
    })
  })
  signal.register((state, event) => {
    t.deepEqual(event, expected, 'Apply can decorate events')
  })

  signal.emit(event)
})

tape('Multiple applicators can be attached', t => {
  t.plan(2)

  const signal = Signal.of({})
  const applicator = fn => {
    t.pass('Applicator is called')
    return (state, event) => fn(state, event) || state
  }

  signal.register(identity)
  signal.apply(applicator)
  signal.apply(applicator)
  signal.emit({})
})

tape('Applicators are applied to multiple updates', t => {
  t.plan(2)

  const signal = Signal.of({})
  const applicator = fn => {
    t.pass('Applicator is called')
    return (state, event) => fn(state, event) || state
  }

  signal.register(identity)
  signal.register(identity)
  signal.apply(applicator)
  signal.emit({})
})
