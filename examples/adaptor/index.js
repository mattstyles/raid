
import {render} from 'react-dom'

import {element, App} from '../_common'
import {signal} from './store'
import {counter} from './update'

import Message from './message'
import Counter from './counter'

// const App = state => (
//   <div>
//     <Message msg='Hello' />
//     <Counter />
//   </div>
// )

signal.register(counter)

signal.observe(state => render(
  <App state={state}>
    <Message msg='Hello' />
    <Counter />
  </App>,
  element
), err => console.error(err))
