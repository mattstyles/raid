
import { render } from 'react-dom'
import { compress } from '@raid/addons'

import { element, H1, App } from '../_common'

import { signal } from './store'
import { resize, actions } from './resize'
import Flex from './flex'

signal.register(compress({
  [actions.resize]: (state, payload) => ({
    ...state,
    ...payload
  })
}))

signal.mount(resize)

signal.observe(state => render(
  <App state={state}>
    <H1>Main</H1>
    <Flex />
  </App>,
  element
))
