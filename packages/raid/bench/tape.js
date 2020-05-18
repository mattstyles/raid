
import tape from 'tape'

// eslint-disable-next-line
import { makeTest, identity, noop, random } from './tests'
import prettyTime from 'pretty-hrtime'

const test = (name, options) => {
  tape(name, t => {
    t.plan(1)

    const { numObservers, numEmits, iterations } = options
    // Initial firing plus test firings
    let numTests = (numObservers) + (numObservers * numEmits * iterations)
    options.observer = _ => {
      numTests--
    }

    const single = makeTest(options)

    single.signal.observe(() => {
      if (numTests <= 0) {
        const end = process.hrtime(start)
        t.pass('Fin')
        console.log(name, '::')
        console.log(`${iterations * numEmits} trials in`, prettyTime(end), '\n')
      }
    })

    const start = process.hrtime()

    setTimeout(() => {
      for (let i = 0; i < iterations; i++) {
        single()
      }
    }, 10)
  })
}

// Observers don't really have much of a bearing as it does very very little.
// Number of updates does as it uses Math.random.
// Emits * Iterations gives the number of trials. Number of trials being the
// important variable, swapping emits and iterations has very little bearing.
test('Updates: 1e2. Observers: 1e2. Emits: 1e1. Iterations: 1e4', {
  numUpdates: 1e2,
  update: random,
  numObservers: 1e2,
  numEmits: 1e1,
  iterations: 5e3
})

// Running more than one bench causes issues, which is probably GC thrashing,
// which might well be caused by a lack of decent teardown
// test('Emits: 1e4. Updates: 1. Observers: 1. Iterations: 1', {
//   numUpdates: 1e2,
//   update: random,
//   numObservers: 1,
//   numEmits: 1e4,
//   iterations: 1e2
// })
