
import {render} from 'react-dom'

import element from '../_common/element'
import {signal} from './store'
import {counter} from './update'

import Message from './message'
import Counter from './counter'

const App = state => (
  <div>
    <Message msg='Hello' />
    <Counter />
  </div>
)

signal.register(counter)

signal.observe(state => render(<App />, element))
