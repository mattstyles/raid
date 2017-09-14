
import {createSelector} from 'reselect'

import {connect, dispatch} from 'signals'
import {getMessage} from './selectors'
import actions from './actions'

const dispatchAction = dispatch(actions.onAction)

const {{componentName}} = ({message}) => (
  <div
    className='root'
    onClick={dispatchAction}
  >
    {message}
    <style jsx>{`
      .root {
        font-size: 1.2rem;
        color: rgb(244, 48, 22);
      }
    `}</style>
  </div>
)

const selector = createSelector(
  getMessage,
  (message) => ({
    message
  })
)

export default connect(
  selector,
  {{componentName}}
)
