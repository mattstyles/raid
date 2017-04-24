
// import {createMemoryHistory} from 'history'
import {createSelector} from 'reselect'
import {init} from 'raid-navigator/src'

import {history} from './history'

import {Button} from '../_common'
import {signal, connect} from './store'

// const history = createMemoryHistory()
// window.appHistory = history

// export const initial = setInitial({
//   history
// })
//
// console.log(initial)

const {
  Navigator,
  update,
  actions: {
    push,
    back,
    forward
  }
} = init({
  signal,
  history
})

export const memoryUpdate = update

export const Navigation = connect(
  createSelector(
    state => state.navigation,
    () => signal,
    (navigation, signal) => ({
      navigation,
      signal
    })
  ),
  Navigator
)

export const Push = ({children, route, state}) => (
  <Button onClick={event => push(route, state)}>
    {children}
  </Button>
)

const NavButton = ({children, onClick, disabled}) => (
  <Button
    styles={disabled
      ? {
        background: 'rgb(255, 255, 255)',
        color: 'rgb(232, 234, 238)'
      }
      : {
        background: 'rgb(255, 255, 255)',
        color: 'rgb(64, 64, 64)'
      }
    }
    onClick={onClick}
  >{children}</Button>
)

export const Back = connect(
  ({navigation}) => ({navigation}),
  ({children, navigation}) => {
    const {index} = navigation
    const disabled = index === 0
    return (
      <NavButton
        disabled={disabled}
        onClick={event => {
          if (disabled) return
          back()
        }
      }>{'<'}</NavButton>
    )
  }
)

export const Forward = connect(
  ({navigation}) => ({navigation}),
  ({children, navigation}) => {
    const {stack, index} = navigation
    const disabled = index === stack.length - 1
    return (
      <NavButton
        disabled={disabled}
        onClick={event => {
          if (disabled) return
          forward()
        }
      }>{'>'}</NavButton>
    )
  }
)
