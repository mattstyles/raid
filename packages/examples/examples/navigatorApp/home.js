
import { View, Spacer, ButtonGroup } from '@raid/basic-kit'

import { Title } from './component'
import { Push } from './navigation'

export const Home = () => {
  return (
    <View>
      <Title>Index</Title>
      <Spacer py={2} />
      <ButtonGroup>
        <Push route='/page/string'>Home</Push>
        <Push route='/settings'>Settings</Push>
      </ButtonGroup>
    </View>
  )
}
