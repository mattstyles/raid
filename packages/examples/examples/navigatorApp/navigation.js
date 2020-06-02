
import { createSelector } from 'reselect'
import { Navigator, push, back, forward } from '@raid/navigator'

import { Button } from '@raid/basic-kit'
import { signal, connect } from './store'

export const Navigation = connect(
  createSelector(
    state => state.navigation,
    () => signal,
    (navigation, signal) => ({
      navigation,
      signal,
      storage: window.sessionStorage
    })
  ),
  Navigator
)

export const Push = ({ children, route, state }) => (
  <Button onClick={event => push(route, state)}>
    {children}
  </Button>
)

const NavButton = ({ children, onClick, disabled }) => (
  <Button
    tight
    disabled={disabled}
    onClick={onClick}
  >{children}
  </Button>
)

export const Back = connect(
  ({ navigation }) => ({ navigation }),
  ({ children, navigation }) => {
    const { index } = navigation
    const disabled = index === 0
    return (
      <NavButton
        disabled={disabled}
        onClick={event => {
          back()
        }}
      >{'<'}
      </NavButton>
    )
  }
)

export const Forward = connect(
  ({ navigation }) => ({ navigation }),
  ({ children, navigation }) => {
    const { stack, index } = navigation
    const disabled = index === stack.length - 1
    return (
      <NavButton
        disabled={disabled}
        onClick={event => {
          forward()
        }}
      >{'>'}
      </NavButton>
    )
  }
)
