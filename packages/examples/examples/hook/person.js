
import { Spacer, ButtonGroup, Card, Text, Button } from '@raid/basic-kit'
import { dispatch, actions } from './actions'

export const Person = ({ name, age }) => (
  <Card depth={1}>
    <Text block size={5}>{name}</Text>
    <Text block>{`Age: ${age}`}</Text>
    <Spacer py={2} />
    <ButtonGroup>
      <Button onClick={dispatch(actions.changeAge)}>Update Age</Button>
      <Button onClick={dispatch(actions.changeName)}>Update Name</Button>
    </ButtonGroup>
  </Card>
)
