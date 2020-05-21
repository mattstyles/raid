
/**
 * The useSignal hook also allows a selector function to be passed in
 */

import { render } from 'react-dom'
import { Card, Flex, Text, Input, Spacer } from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal } from '@raid/hooks'
import { debug } from '@raid/addons/debug'

import { App, element } from '../_common'

const signal = Signal.of({
  title: ''
})

const update = (state, event) => {
  if (event.type === 'setTitle') {
    return {
      ...state,
      title: event.payload
    }
  }

  return state
}

const Title = ({ children }) => {
  if (!children) {
    return null
  }

  return (
    <Card depth={1}>
      <Text size={8}>{children}</Text>
    </Card>
  )
}

const cap = str => str.replace(/^./, char => char.toUpperCase())

const Control = () => {
  const { state, emit } = useSignal(signal, state => state?.title && cap(state.title))

  return (
    <>
      <Flex row>
        <Input
          variant='flat'
          placeholder='Start typing...'
          onChange={str => emit({ type: 'setTitle', payload: str })}
        />
      </Flex>
      <Spacer py={3} />
      <Title>{state}</Title>
    </>
  )
}

const AppViewer = ({ children }) => {
  const { state } = useSignal(signal)

  return (
    <App state={state}>
      {children}
    </App>
  )
}

render(
  <AppViewer>
    <Control />
  </AppViewer>,
  element
)

signal.register(update)
signal.register(debug('[useSignal]'))
