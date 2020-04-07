
import { createStructuredSelector } from 'reselect'
import { css } from '@styled-system/css'

import {connect, dispatch} from 'signals'
import {getMessage} from './selectors'
import actions from './actions'

const dispatchAction = dispatch(actions.onAction)

const Button = styled('div')(
  css({
    background: 'info.600',
    color: 'white',
    px: 6,
    py: 2
  })
)

const {{componentName}} = ({ message }) => (
  <Button
    onClick={dispatchAction}
  >
    {message}
  </Button>
)

const selector = createStructuredSelector({
  message: getMessage
})

export default connect(
  selector,
  {{componentName}}
)
