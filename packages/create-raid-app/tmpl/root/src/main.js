
import {render} from 'react-dom'

import {signal} from 'signals'
import App from 'views/app'
import {debug} from 'core/updates'

const el = document.querySelector('.js-main')

if (process.env.DEBUG) {
  signal.register(debug)
}

signal.observe(state => {
  render(
    <App state={state} />,
    el
  )
}, err => console.error(err))
