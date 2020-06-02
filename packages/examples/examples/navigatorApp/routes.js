
import { View, Text, Spacer, ButtonGroup } from '@raid/basic-kit'

import { Navigation, Push } from './navigation'
import { Home } from './home'

const Page = ({ params }) => {
  return (
    <View>
      <Text block size='xl' fontWeight={700}>{`Page ${params.id}`}</Text>
      <Spacer py={2} />
      <ButtonGroup>
        <Push route='/'>Index</Push>
        <Push route='/settings'>Settings</Push>
      </ButtonGroup>
    </View>
  )
}

const Settings = () => {
  return (
    <View>
      <Text block size='xl' fontWeight={700}>Settings</Text>
      <Spacer py={2} />
      <ButtonGroup>
        <Push route='/'>Index</Push>
        <Push route='/page/23'>Home</Push>
      </ButtonGroup>
    </View>
  )
}

export const Routes = () => {
  return (
    <Navigation>
      <Home route='/' />
      <Page route='/page/:id' />
      <Settings route='/settings' />
    </Navigation>
  )
}
