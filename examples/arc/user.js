
import {Button} from '../_common'

import {dispatch, actions} from './actions'

const getUserData = ({name, avatar_url}) => ({
  name,
  image: avatar_url
})

const styles = {
  container: {margin: 30, background: 'white', borderRadius: 3, padding: 12, display: 'table'},
  btn: {
    marginRight: 0,
    marginTop: 0,
    background: 'rgb(125,91,166)',
    width: 180
  }
}

const UI = ({isRequesting}) => (
  <div style={styles.container}>
    <Button
      styles={styles.btn}
      onClick={dispatch(actions.request)}
    >
      {isRequesting ? 'Updating...' : 'Trigger Update'}
    </Button>
  </div>
)

const Avatar = ({name, image}) => (
  <div style={styles.container}>
    <h2>{name}</h2>
    <img src={image} width={120} height={120} />
  </div>
)

const wrap = Component => ({user, err}) => {
  if (err) {
    return <pre>{JSON.stringify(err, '  ', null)}</pre>
  }

  if (!user) {
    return null
  }
  let data = getUserData(user)
  return <Component {...data} />
}
const User = wrap(Avatar)

// Debug user props
const tap = fn => function () {
  if (process.env.DEBUG) {
    console.log('User props::', ...arguments)
  }
  return fn(...arguments)
}

export const Main = tap(({user, isRequesting, err}) => (
  <div>
    <UI isRequesting={isRequesting} />
    <User user={user} err={err} />
  </div>
))
