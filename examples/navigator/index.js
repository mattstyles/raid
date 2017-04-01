
import {render} from 'react-dom'

import {Signal} from 'raid/src'
import {Navigator} from 'raid-navigator/src'

import element from '../_common/element'

const signal = new Signal({})

signal.observe(state => {
  render(
    <Navigator />,
    element
  )
}, err => console.error(err))
