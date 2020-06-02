
/**
 * Adding a navigator to an app full example.
 * Hot reloading can go a little awry due to hooks and the action dispatched
 * when Navigator first mounts. This only manifests in routes as HMR tries to
 * work out what needs to reload.
 */

import { render } from 'react-dom'
import { debug } from '@raid/addons/debug'
import { ButtonGroup, Flex, Spacer } from '@raid/basic-kit'

import { Push, Back, Forward } from './navigation'
import { signal } from './store'
import { Routes } from './routes'

import { element, App } from '../_common'

signal.register(debug())

const Nav = () => {
  return (
    <Flex row>
      <ButtonGroup condensed rounding='circular'>
        <Back />
        <Forward />
      </ButtonGroup>
      <Spacer px={2} />
      <Push route='/foo'>Unmatched</Push>
    </Flex>
  )
}

signal.observe(state => {
  render(
    <App state={state}>
      <Nav />
      <Spacer py={4} />
      <Routes />
    </App>,
    element
  )
}, err => console.error(err))

/**
 * In latest versions of HMR a page refresh is done and true HMR is opt-in
 * by calling `module.hot.accept`. This breaks this more frequently than is
 * helpful and moves dev further from prod, so create-raid-app won't bundle
 * with it enabled. If your project is resilient to the ill effects of HMR
 * (which is largely dependent on side effects in code) then it can be
 * enabled by choice, rather than by default.
 */
// if (module.hot) {
//   module.hot.dispose(() => {
//     console.group('[HMR] dispose')
//
//     signal.disposeAll()
//     signal.detachAll()
//
//     console.groupEnd('[HMR] dispose')
//   })
//   module.hot.accept(() => {
//     console.group('[HMR] accept')
//     signal.emit({
//       hmr: 'accept'
//     })
//     console.groupEnd('[HMR] accept')
//   })
// }
