
import {render} from 'inferno-dom'

import {Signal} from 'raid/src'

import element from '../_common/element'
import Button from '../_common/actionButton'
import {View, Main, Code} from '../_common/layout'

import {fromEvent} from 'most'
import EventEmitter from 'eventemitter3'

const emitter = new EventEmitter()
const source = fromEvent('action', emitter)

const signal = new Signal({
  count: 0
})

signal.mount(source)

const dispatch = type => payload => signal.emit({type, payload})
const sourceDispatch = type => payload => emitter.emit('action', {type, payload})

const actions = {
  add: 'actions:add',
  subtract: 'actions:subtract'
}

const update = (state, event) => {
  console.log('update')
  if (event.type === actions.add) {
    state.count += 1
    return state
  }

  if (event.type === actions.subtract) {
    state.count -= 1
    return state
  }

  return state
}

signal.register(update)

const App = ({state}) => {
  return (
    <View>
      <Main>
        <Button onClick={dispatch(actions.add)}>Add</Button>
        <Button
          onClick={sourceDispatch(actions.add)}
          background='rgb(24, 190, 80)'
        >Add 2</Button>
      </Main>
      <Code>
        <pre>{JSON.stringify(state, null, '  ')}</pre>
      </Code>
    </View>
  )
}

signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
})
