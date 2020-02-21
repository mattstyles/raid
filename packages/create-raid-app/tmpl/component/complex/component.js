
import { createStructuredSelector } from 'reselect'

import {connect, dispatch} from 'signals'
import {getMessage} from './selectors'
import actions from './actions'

const dispatchAction = dispatch(actions.onAction)

const Button = styled('div')`
  background: blue;
  color: white;
  padding: 3px 18px;
`

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
