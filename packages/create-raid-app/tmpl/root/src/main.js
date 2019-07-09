
import { render } from 'react-dom'
import { debug } from 'raid-addons'

import { signal } from 'signals'
import { App } from 'views/app'

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
