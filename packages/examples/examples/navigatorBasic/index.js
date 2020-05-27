
/**
 * Adding a navigator to an app example.
 */

import { render } from 'react-dom'
import { debug } from '@raid/addons/debug'

import { Navigation, Push, Back, Forward } from './navigation'
import { signal } from './store'

import { ButtonGroup, Flex, Spacer, Text } from '@raid/basic-kit'
import { element, App } from '../_common'

const View = ({ children, params, route }) => {
  console.log('params:', params)
  console.log('route:', route)
  return children
}

signal.register(debug())

signal.observe(state => {
  render(
    <App state={state}>
      <Flex row>
        <ButtonGroup condensed rounding='circular'>
          <Back />
          <Forward />
        </ButtonGroup>
        <Spacer px={2} />
        <Push route='/foo'>Unmatched</Push>
      </Flex>
      <Spacer py={4} />
      <Navigation>
        <View route='/'>
          <Text block size='xl' fontWeight={700}>Index</Text>
          <Spacer py={2} />
          <ButtonGroup>
            <Push route='/home/string'>Home</Push>
            <Push route='/settings'>Settings</Push>
          </ButtonGroup>
        </View>
        <View route='/home/:id'>
          <Text block size='xl' fontWeight={700}>Home</Text>
          <Spacer py={2} />
          <ButtonGroup>
            <Push route='/'>Index</Push>
            <Push route='/settings'>Settings</Push>
          </ButtonGroup>
        </View>
        <View route='/settings'>
          <Text block size='xl' fontWeight={700}>Settings</Text>
          <Spacer py={2} />
          <ButtonGroup>
            <Push route='/'>Index</Push>
            <Push route='/home/23'>Home</Push>
          </ButtonGroup>
        </View>
      </Navigation>
    </App>,
    element
  )
}, err => console.error(err))
