
import { createSelector } from 'reselect'

import { Spacer, Button, ButtonGroup, Text, Card } from '@raid/basic-kit'
import { connect } from './store'
import { actions, dispatch } from './actions'

const CountWidget = ({ count }) => {
  return (
    <Card depth={1} sx={{ display: 'inline-block' }}>
      <Text size={7} block sx={{ textAlign: 'center' }}>{count}</Text>
      <Spacer py={1} />
      <ButtonGroup ix={2}>
        <Button
          variant='primary'
          onClick={dispatch(actions.add)}
        >
          +
        </Button>
        <Button
          variant='primary'
          onClick={dispatch(actions.subtract)}
        >
          -
        </Button>
      </ButtonGroup>
    </Card>
  )
}

const selector = createSelector(
  state => state.count,
  count => ({ count })
)
export default connect(selector, CountWidget)
