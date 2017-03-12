
import {render} from 'inferno-dom'

import element from '../_common/element'
import {signal} from './store'
import {counter} from './update'

import Message from './message'
import Counter from './counter'

const App = state => {
  return <div>
    <Message msg='Hello' />
    <Counter />
  </div>
}

signal.register(counter)

signal.observe(state => {
  render(<App />, element)
})
