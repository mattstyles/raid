
import { Signal } from '../src'

/**
 * functions
 */
export const identity = _ => _
export const noop = () => {}
export const expensive = _ => {
  // @TODO
}
export const realistic = _ => {
  // @TODO
}
export const random = _ => {
  return Math.random().toString(32)
}

// export const single = () => {
//   const signal = Signal.of({})
//   signal.register(identity)
//   signal.observe(identity)
//   signal.emit({})
// }

/**
 * Allow configuration of the test.
 * We create and attach updates/observers within the closure, to do so
 * only once. Then the test function just passes lots of emits through the
 * signal as this is the primary use-case.
 * We should also test attaching/detaching updates and observers during the
 * life-time of the signal.
 */
export const makeTest = ({
  name = '@TODO',
  initial = {},
  update = identity,
  numUpdates = 1,
  observer = noop,
  numObservers = 1,
  emit = () => ({}),
  numEmits = 1
} = {}) => {
  const signal = Signal.of(initial)
  for (let i = 0; i < numUpdates; i++) {
    signal.register(update)
  }

  for (let i = 0; i < numObservers; i++) {
    signal.observe(observer)
  }

  const test = () => {
    for (let i = 0; i < numEmits; i++) {
      // console.log('emitting', i, 'of', numEmits)
      signal.emit(emit())
    }
  }
  test.signal = signal

  return test
}
