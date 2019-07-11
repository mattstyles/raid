
import { render } from 'react-dom'
import { debug } from 'raid-addons'

import { signal } from 'signals'
import { App } from 'components/app'
import { Navigation } from 'components/navigation'

const el = document.querySelector('.js-main')

if (process.env.DEBUG) {
  signal.register(debug('[{{projectName}}]'))
}

signal.observe(state => {
  render(
    <App>
      <Navigation navigation={state.navigation} />
    </App>,
    el
  )
}, err => console.error(err))

if (module.hot) {
  module.hot.dispose(() => {
    console.group('[HMR] dispose')
    console.log('disposing signal updates')

    signal.disposeAll()
    signal.observers = []

    console.groupEnd('[HMR] dispose')
  })
  module.hot.accept(() => {
    console.group('[HMR] accept')
    signal.emit({
      hmr: 'accept'
    })
    console.groupEnd('[HMR] accept')
  })
}
