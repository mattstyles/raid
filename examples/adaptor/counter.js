
import { createSelector } from 'reselect'

import { Button, Spacer, Flex, Text, Card } from '@raid/basic-kit'
import { connect } from './store'
import { ACTIONS, dispatch } from './actions'

const CountWidget = ({ count }) => {
  return (
    <Card depth={2} sx={{ display: 'inline-block' }}>
      <Text size={7} block sx={{ textAlign: 'center' }}>{count}</Text>
      <Flex row>
        <Button
          variant='primary'
          onClick={dispatch(ACTIONS.ADD)}
        >+</Button>
        <Spacer px={1} />
        <Button
          variant='primary'
          onClick={dispatch(ACTIONS.SUBTRACT)}
        >-</Button>
      </Flex>
    </Card>
  )
}

const selector = createSelector(
  state => state.count,
  count => ({ count })
)
export default connect(selector, CountWidget)
