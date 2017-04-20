
import {render} from 'react-dom'
// import {update} from 'raid-navigator/src'
import {element} from '../_common'

import {signal} from './store'
import {register} from './updates'
import App from './app'

register()

signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
}, err => console.error(err))
