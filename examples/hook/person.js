
import {Card, H2, P, Button, Inline} from '../_common'
import {dispatch, actions} from './actions'

export const Person = ({name, age}) => (
  <Card>
    <H2>{name}</H2>
    <P>{`Age: ${age}`}</P>
    <Inline>
      <Button
        onClick={dispatch(actions.changeAge)}
      >Update Age</Button>
      <Button
        onClick={dispatch(actions.changeName)}
      >Update Name</Button>
    </Inline>
  </Card>
)
