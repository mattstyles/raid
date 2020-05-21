
import { render } from 'react-dom'
import { element } from '../_common'

import { signal } from './store'
import App from './app'

signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
}, err => console.error(err))
