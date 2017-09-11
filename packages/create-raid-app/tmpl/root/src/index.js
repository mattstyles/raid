
import {render} from 'react-dom'
import {Signal} from 'raid'

import Title from './components/title'

const signal = new Signal({})

const el = document.querySelector('.js-main')

signal.observe(state => {
  render(
    <Title text='Hello {{projectName}}' />,
    el
  )
}, err => console.error(err))
