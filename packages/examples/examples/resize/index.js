
import { render } from 'react-dom'
import { compress } from '@raid/addons'

import { Spacer, Text } from '@raid/basic-kit'
import { element, App } from '../_common'

import { signal } from './store'
import { resize, actions } from './resize'
import { Dimensions } from './dimensions'

signal.register(compress({
  [actions.resize]: (state, payload) => ({
    ...state,
    ...payload
  })
}))

signal.mount(resize)

signal.observe(state => render(
  <App state={state}>
    <Text block size='xl' fontWeight={700}>Main</Text>
    <Spacer py={2} />
    <Dimensions />
  </App>,
  element
))
