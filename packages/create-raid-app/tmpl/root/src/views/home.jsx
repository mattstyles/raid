
import { createStructuredSelector } from 'reselect'
import { View } from 'react-basic-kit'

import { connect } from 'signals'
import { Title } from 'components/title'
import { getMessage } from 'core/selectors'

const viewSelector = createStructuredSelector({
  message: getMessage
})

export const Home = connect(
  viewSelector,
  ({ message }) => (
    <View>
      <Title text='{{projectName}}' />
    </View>
  )
)
