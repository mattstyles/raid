
import { View, Flex, ButtonGroup, Spacer, Text } from '@raid/basic-kit'

import { Navigation, Push, Back, Forward } from './navigation'
import { App } from '../_common'

export default ({ state }) => (
  <App state={state}>
    <Flex row>
      <ButtonGroup condensed rounding='circular'>
        <Back />
        <Forward />
      </ButtonGroup>
    </Flex>
    <Spacer py={4} />
    <Navigation>
      <View route='/'>
        <Text block size='xl' fontWeight={700}>Index</Text>
        <Spacer py={2} />
        <ButtonGroup>
          <Push route='/home'>Home</Push>
          <Push route='/settings'>Settings</Push>
        </ButtonGroup>
      </View>
      <View route='/home'>
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
          <Push route='/home'>Home</Push>
        </ButtonGroup>
      </View>
    </Navigation>
  </App>
)
