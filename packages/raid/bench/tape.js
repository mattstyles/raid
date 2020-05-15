
import tape from 'tape'
// import Benchmark from 'benchmark'

import { makeTest } from './tests'
import prettyTime from 'pretty-hrtime'

const numUpdates = 1e6
const numObservers = 1e4
const numEmits = 1
const iterations = 1
// The *2 is because each initial observe function causes a trigger,
// whereas we're only interested in the _next_ one here
let numTests = ((numObservers * 2)) * numEmits
console.log({ numTests })

tape('it waits until all events are passed through the signal', t => {
  t.plan(1)

  const single = makeTest({
    name: 'Single',
    numUpdates: numUpdates,
    update: _ => {
      const num = Math.random().toString(32)
      // console.log('tap', num)
      return num
    },
    numObservers: numObservers,
    observer: event => {
      // console.log('  obs', event)
      numTests--
    },
    numEmits: numEmits
  })

  single.signal.observe(() => {
    console.log('  reducer observer firing', numTests)
    // numTests--

    if (numTests < 0) {
      console.log('end', numTests)
      const end = process.hrtime(start)
      t.pass('Fin')
      console.log(`Done ${iterations} tests in`, prettyTime(end))
    }
  })

  const start = process.hrtime()

  for (let i = 0; i < iterations; i++) {
    single()
  }
})
