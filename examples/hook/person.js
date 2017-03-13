
import Button from '../_common/actionButton'
import {dispatch, actions} from './actions'

const styles = `
  .container {
    margin: 30px;
    background: white;
    border-radius: 3px;
    padding: 12px;
    font-size: 1.5rem;
    display: table;
  }
  .btn {
    display: block;
    margin-right: 0;
    margin-top: 8px;
  }
`

export const Person = ({name, age}) => {
  return (
    <div className='container'>
      <h2>{name}</h2>
      <p>{`Age: ${age}`}</p>
      <Button
        classes='btn'
        onClick={dispatch(actions.changeAge)}
      >Update Age</Button>
      <Button
        classes='btn'
        onClick={dispatch(actions.changeName)}
      >Update Name</Button>
      <style jsx>{styles}</style>
    </div>
  )
}
