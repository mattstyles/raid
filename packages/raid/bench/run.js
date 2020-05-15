
import Benchmark from 'benchmark'

import { printf } from './log'
import { makeTest } from './tests'
import prettyTime from 'pretty-hrtime'

// const test = {
//   name: 'Single'
// }
//
// const bench = Benchmark(test.name, makeTest(test), {
//   // onCycle: printf,
//   onError: err => console.error(err),
//   onComplete: event => {
//     console.log('Done.\n')
//     printf(event)
//   }
// })
//
// bench.run()

// const suite = new Benchmark.Suite('Signal')

// suite
//   .on('cycle', printf)
//   .on('error', e => console.error(e))
//   .on('complete', event => {
//     // @TODO is data collection here better to post to storage? probably.
//     console.log('Done.')
//   })

// suite.add('single', makeTest({
//   name: 'single'
// }))

// suite.add('100x-updates', makeTest({
//   update: _ => {
//     return {
//       count: Math.random()
//     }
//   },
//   numUpdates: 2,
//   observer: () => console.log('ooof'),
//   numObservers: 2
// }))

// suite.add('100x-observers', makeTest({
//   numObservers: 1e1
// }))

// suite.run()

const numUpdates = 4
const numObservers = 1
const numEmits = 1
const iterations = 1
let numTests = numObservers * numEmits

const single = makeTest({
  name: 'Single',
  numUpdates: numUpdates,
  update: _ => {
    const num = Math.random().toString(32)
    console.log('tap', num)
    return num
  },
  numObservers: numObservers,
  observer: event => {
    console.log('  obs', event)
  },
  numEmits: numEmits
})

single.signal.observe(() => {
  numTests--
})

const start = process.hrtime()
// for (let i = 0; i < iterations; i++) {
//   single()
// }

do {
  single()
} while (numTests >= 0)

const end = process.hrtime(start)
// setTimeout(() => {
console.log(`Done ${iterations} tests in`, prettyTime(end))
// }, 5000)
