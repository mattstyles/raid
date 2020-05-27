
import { render } from 'react-dom'
import { debug } from '@raid/addons/debug'

import { RouteMatcher } from '@raid/navigator'
import { Navigation, Push, Back, Forward } from './navigation'
import { signal } from './store'

import { ButtonGroup, Flex, Spacer, Text, Card } from '@raid/basic-kit'
import { element, App } from '../_common'

const View = ({ children, params, route }) => {
  console.log('params:', params)
  console.log('route:', route)
  return children
}

// Base debug function
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
            <Push route='/home/foo'>Home/foo</Push>
            <Push route='/home/bar'>Home/bar</Push>
            <Push route='/settings'>Settings</Push>
          </ButtonGroup>
        </View>
        <View route='/home/foo'>
          <Text block size='xl' fontWeight={700}>Home/foo</Text>
          <Spacer py={2} />
          <ButtonGroup>
            <Push route='/home/bar'>Home/bar</Push>
            <Push route='/settings'>Settings</Push>
          </ButtonGroup>
        </View>
        <View route='/home/bar'>
          <Text block size='xl' fontWeight={700}>Home/bar</Text>
          <Spacer py={2} />
          <ButtonGroup>
            <Push route='/home/foo'>Home/foo</Push>
            <Push route='/settings'>Settings</Push>
          </ButtonGroup>
        </View>
        <View route='/settings'>
          <Text block size='xl' fontWeight={700}>Settings</Text>
          <Spacer py={2} />
          <ButtonGroup>
            <Push route='/'>Index</Push>
            <Push route='/home/foo'>Home/foo</Push>
            <Push route='/home/bar'>Home/bar</Push>
          </ButtonGroup>
        </View>
      </Navigation>
      <Spacer py={2} />
      <Card>
        <RouteMatcher navigation={state.navigation}>
          <Text block route='/home/*'>Matched on home.</Text>
          <Text block route='/settings/*'>Matched on settings.</Text>
          <Text block route='*'>Matches on everything.</Text>
        </RouteMatcher>
      </Card>
    </App>,
    element
  )
}, err => console.error(err))
