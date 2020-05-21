
import { render } from 'react-dom'

import { element, App } from '../_common'
import { signal } from './store'
import { counter } from './update'
import { debug } from '@raid/addons'

import Message from './message'
import Counter from './counter'

signal.register(counter)
signal.register(debug('[counter]'))

signal.observe(state => render(
  <App state={state}>
    <Message msg='Hello' />
    <Counter />
  </App>,
  element
), err => console.error(err))
