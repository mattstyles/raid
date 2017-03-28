
import {render} from 'react-dom'
import {compress} from 'raid-addons'

import element from '../_common/element'

import {signal} from './store'
import {resize, actions} from './resize'
import Flex from './flex'

signal.register(compress({
  [actions.resize]: (state, payload) => ({
    ...state,
    ...payload
  })
}))

signal.mount(resize)

const App = state => (
  <div>
    <h1>Main</h1>
    <Flex />
  </div>
)

signal.observe(state => render(<App />, element))
