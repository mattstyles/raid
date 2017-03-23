
import {render} from 'inferno-dom'

import {Signal} from 'raid/src'
import patch from 'raid-addons/src/patch'

import element from '../_common/element'
import Button from '../_common/actionButton'
import {View, Main, Code} from '../_common/layout'

const signal = new Signal({
  patched: {
    foo: 'bar'
  }
})

const actions = {
  'foo': 'bar'
}

const dispatch = type => payload => signal.emit({type, payload})

const update = (state, event) => {
  const {foo} = state
  return {
    ...state,
    foo: foo === 'bar' ? 'quux' : 'bar'
  }
}

const App = ({state}) => {
  return (
    <View>
      <Main>
        <Button onClick={dispatch(actions.foo)}>Click me</Button>
      </Main>
      <Code>
        <pre>{JSON.stringify(state, null, '  ')}</pre>
      </Code>
    </View>
  )
}

// signal.register(patch('patched', update))
signal.register(patch('patched')(update))

signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
})
