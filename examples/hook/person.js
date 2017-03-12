
import Button from '../_common/actionButton'
import {dispatch, actions} from './actions'

const styles = {
  container: {margin: 30, background: 'white', borderRadius: 3, padding: 12, display: 'table'},
  btn: {display: 'block', marginRight: 0, marginTop: 8}
}

export const Person = ({name, age}) => {
  return (
    <div style={styles.container}>
      <h2>{name}</h2>
      <p>{`Age: ${age}`}</p>
      <Button
        styles={styles.btn}
        onClick={dispatch(actions.changeAge)}
      >Update Age</Button>
      <Button
        styles={styles.btn}
        onClick={dispatch(actions.changeName)}
      >Update Name</Button>
    </div>
  )
}
