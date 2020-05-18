
import tape from 'tape'

import { makeTest } from './tests'
import prettyTime from 'pretty-hrtime'

const numUpdates = 1e3
const numObservers = 4
const numEmits = 4
const iterations = 1e3
// The *2 is because each initial observe function causes a trigger,
// whereas we're only interested in the _next_ one here
let numTests = (numObservers) + (numObservers * numEmits * iterations)
console.log({ numTests })

tape('it waits until all events are passed through the signal', t => {
  t.plan(1)

  const single = makeTest({
    name: 'Single',
    initial: { num: 'Initial Single State' },
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
    // console.log('  reducer observer firing', numTests)
    // numTests--

    if (numTests <= 0) {
      console.log('end', numTests)
      const end = process.hrtime(start)
      t.pass('Fin')
      console.log(`Done ${iterations} tests in`, prettyTime(end))
    }
  })

  const start = process.hrtime()

  setTimeout(() => {
    for (let i = 0; i < iterations; i++) {
      // console.log('running single')
      single()
    }
  }, 10)
})
