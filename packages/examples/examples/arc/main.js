
import { Spacer, Box, Button, Card, Text, Image } from '@raid/basic-kit'

import { dispatch, actions } from './actions'

const getUserData = (user) => ({
  name: user.name,
  image: user.avatar_url
})

const wrap = Component => ({ user, err }) => {
  if (err) {
    return <pre>{JSON.stringify(err, '  ', null)}</pre>
  }

  if (!user) {
    return null
  }

  const data = getUserData(user)
  return <Component {...data} />
}

const Interface = ({ isRequesting }) => (
  <Card>
    <Button
      variant='primary'
      onClick={dispatch(actions.request)}
    >
      {isRequesting ? 'Fetching...' : 'Fetch'}
    </Button>
  </Card>
)

const Avatar = ({ name, image }) => (
  <Card>
    <Text as='h2' size={5}>{name}</Text>
    <Image src={image} size='200px' />
  </Card>
)

const User = wrap(Avatar)

// Debug user props
const tap = fn => function () {
  if (process.env.DEBUG) {
    console.log('User props::', ...arguments)
  }
  return fn(...arguments)
}

export const Main = tap(({ user, isRequesting, err }) => (
  <Box>
    <Interface isRequesting={isRequesting} />
    <Spacer py={2} />
    <User user={user} err={err} />
  </Box>
))
