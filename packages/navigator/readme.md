
# @raid/navigator

> Navigation stack hooked in to a raid signal

[![npm](https://img.shields.io/npm/v/@raid/navigator.svg?style=flat)](https://www.npmjs.com/package/@raid/navigator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=composer)](https://travis-ci.org/mattstyles/raid)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Documentation](https://mattstyles.github.io/raid/)

## Install

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add @raid/navigator
```

```sh
npm i -S @raid/navigator
```

## Example

```js
import { render } from 'react-dom'
import { Navigator } from '@raid/navigator'
import { Signal } from 'raid'

const signal = new Signal()

signal.observe(state => {
  render(
    <Navigator signal={signal} navigation={state.navigation}>
      <div route='/'>
        <h1>Index</h1>
      </div>
      <div route='/settings'>
        <h1>Settings</h1>
      </div>
    </Navigator>
    document.querySelector('root')
  )
})
```

## Usage

@raid/navigator controls and selects a set of routes based on the current history state, usually this means selecting a single route but multiple will
be rendered if they match. In addition navigator passes the current route state to any matched children.

### signal `<Signal>`

The state raid signal to hook in to. Just pass it in, navigator will do the rest.

### navigation `<Object>`

The current navigation stack, pulled from state.

### history

A history implementation to use, this defaults to `history/createBrowserHistory` but anything that implements the same api would work just fine.

### storage

Navigator will not try to be too smart and, by default, each page refresh will get a clean navigation state to work with. You can pass in `sessionStorage` (or anything else) if you want though and the navigation state will be initialised from that persistent state.

Detailed `Navigator` component [api](#api—navigator) documentation.

## Browser history navigator

By default navigator will attempt to use browser memory, which means that navigation events you handle in code will be reflected in the browser history (i.e. the browser navigation buttons will do as you would expect given your app navigation). Browser history is typically session based, you can add `sessionStorage` to the `storage` parameter to initialise based on the browser history.

## Getting Started

To get started include `raid` and set up a signal. `@raid/navigator` exposes an initial state that can be added to the signal but its unnecessary as the navigator component will sort it out when it mounts.

> This example can all be placed in one file, any dependencies relate to the snippet they are in but remember to place those imports at the top of the file. As things progress, splitting into multiple files is beneficial.

```js
import { Signal } from 'raid'

const signal = new Signal()
```

Navigator requires a signal to work against and navigation array passed to it.

```js
import { render } from 'react-dom'
import { Navigator } from '@raid/navigator'

signal.observe(state => {
  render(
    <Navigator navigation={state.navigation} signal={signal}>
      {/* ..routes */}
    </Navigator>,
    document.querySelector('js-root')
  )
})
```

Rather than adding them as props directly it can be beneficial to use `adaptor` (from [@raid/addons](https://www.npmjs.com/package/addons)) and supply the props that way. The following example also uses [reselect](https://www.npmjs.com/package/reselect) to create a memoized selector to pull the navigation array out of state.

```js
import { createSelector } from 'reselect'
import { adaptor } from '@raid/addons'
import { Navigator } from '@raid/navigator'

const connect = adaptor(signal)

const Navigation = connect(
  createSelector(
    state => state.navigation,
    (navigation) => ({
      navigation,
      signal
    })
  ),
  Navigator
)
```

Navigator aims to be (relatively) easy to get set up and running, we need one more step which is to implement the routes and render the app.

```js
import { render } from 'react-dom'

signal.observe(state => {
  render(
    <Navigation>
      <div route='/'>
        <h1>Index</h1>
      </div>
      <div route='/settings'>
        <h1>Settings</h1>
      </div>
    </Navigation>
    document.querySelector('js-root')
  )
})
```

Navigator is now hooked up to state and will work to select routes based on pathname but we can still go a little further and make this more usable by adding a `Link` component which will update the navigation stack. Navigator exposes a few actions so to create the `Link` component we need to create something that pokes at the action and let navigator handle the rest.

```js
import { push } from '@raid/navigator'

const Link = ({ children, route, state }) => (
  <a onClick={event => push(route, state)}>
    {children}
  </a>
)
```

Now update the render method to use the `Link` component.

```js
render(
  <Navigation>
    <div route='/'>
      <h1>Index</h1>
      <Link route='/settings'>Go to settings</Link>
    </div>
    <div route='/settings'>
      <h1>Settings</h1>
      <Link route='/'>Go to index</Link>
    </div>
  </Navigation>,
  document.querySelector('root')
)
```

## Memory history navigator

The history implementation can be altered via props. This can be particularly useful if you don’t want to use the browser history, or you aren’t running in a context where that makes any sense (for example an Electron or Cordova app).

To get started set up a raid signal as before but also instantiate a [memory history implementation](https://www.npmjs.com/package/history) and use that to let navigator set things up.

```js
import { Signal } from 'raid'
import { adaptor } from '@raid/addons'
import { Navigator } from '@raid/navigator'
import { createMemoryHistory } from 'history'

const signal = new Signal()
const connect = adaptor(signal)
const history = createHistory()
```

We’ll supply the navigator with props using the `reselect` and `adaptor` pattern, as before, but this time we will also pass in the history instance we want navigator to use.

> As of version 6, navigator will default to not use any persistent storage so there is no need to remove it here (as there was previously).

```js
import { createSelector } from 'reselect'

const Navigation = connect(
  createSelector(
    state => state.navigation,
    (navigation) => ({
      history,
      navigation,
      signal
    })
  ),
  Navigator
)
```

To make the navigator more usable we could do with a `Link` function again and navigator exposes a helper to create the actions hooked up to the new history instance.

```js
import { createActions } from '@raid/navigator'

const { push } = createActions(history)

const Link = ({ children, route, state }) => (
  <button onClick={event => push(route, state)}>
    {children}
  </button>
)
```

And thats it, just a few quick changes to use memory history instead of browser history.

See also [the memory history example](https://github.com/mattstyles/raid/tree/master/packages/examples/examples/navigatorMemory)

## Route parameters

The match algorithm will also collect up route parameters and pass those to children as props under the `params` key. Route parameters are delimited by starting with `/:`.

```js
const View = ({ params: { title } }) => <h1>{title}</h1>

render(
  <Navigation>
    <View route='/foo/:title' />
    <View route='/bar/:title' />
  </Navigation>,
  document.querySelector('root')
)
```

## Match on all routes or subroutes

The match algorithm also honours `*` routes as a wildcard to match against all routes or subroutes.

```js
const View = ({ params: { title } }) => <h1>{title}</h1>

render(
  <Navigation>
    <View route='/foo/*' />
    <View route='/bar/*' />
  </Navigation>
  document.querySelector('root')
)
```

## Route Matching Component

`Navigator` is a connected component that attaches to the signal, however, sometimes you might want a supplementary component on your view that can react to url changes but is not connected to a history store.

`RouteMatcher` just implements the route matching algorithm to choose a child without the connectivity that `Navigator` supplies. It does require a navigation stack to match against, so pass that in.

```js
import { render } from 'react-dom'

signal.observe(state => {
  render(
    <RouteMatcher navigation={state.navigation}>
      <div route='/home/*'>Matched on home</div>
      <div route='/settings/*'>Matched on settings</div>
    </RouteMatcher>,
    document.querySelector('root')
  )
})
```

## API—Navigator

```js
  signal: RaidSignal<Required>,
  history: HistoryImpl,
  root: String,
  navigation: Object<Required>,
  Component: Function || Element || Node,
  ComponentProps: Object,
  mapChildren: Function
```

Most properties are optional, only the `navigation` object and the `Raid Signal` to operate against are required.

### navigation

The `navigation` object is the navigation state that `Navigator` persists with the Raid Signal, it does this automatically for you but if you already have a history implementation under a separate key in your Raid Signal then you can supply the state here—this would be extremely rare though and altering the key is discouraged.

### signal

Passing in a `Raid Signal` is required to hook up the `Navigator` to the various events that can trigger a navigation event and includes pre-filling the navigation state when the `Navigator` is instantiated.

### history

Defaults to `history.createBrowserHistory`.

Browser history is the primary target for `Navigator` but any implementation (such as `history.createMemoryHistory`) that matches the specification set out by [history](https://www.npmjs.com/package/history) should work fine.

Note that the default actions exposed by `Navigator` expect to hook in to browser history, if you supply a different history implementation then you’ll also want to create actions based on that history to hook everything up. See the `navigatorMemory` example for clarity.

### storage

By default Navigator will not attempt to store nor retrieve any state.

Passing in something like `window.sessionStorage` via the `storage` prop will change this behaviour, whereby Navigator will attempt to bootstrap the state from storage and persist state changes to storage.

The primary intended target is `sessionStorage` (which will give you pretty consistent results if using `createBrowserHistory`) but any object that implements `getItem` and `setItem` synchronously will work.

### root

This simply tells `Navigator` where it can find the navigation state. It’s not advised to change this, but, if absolutely necessary then you can. It’s just a string that is expected to match the key used in the signal to hold the navigation state.

### Component

Want to wrap your returned route/s in a component? Supply it using `Component`. Useful for implementing animation on route changes.

### ComponentProps

This object is spread as props to the `Component` specified, if you do not supply a `Component` then this is ignored.

### mapChildren

This function is used to transform all children supplied to the `Navigator` component and will occur before attempting to match on a child or children. This can be very useful for wrapping children in a component to help manage animating route changes.

## Running tests

```sh
$ yarn
$ yarn test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `yarn test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

See the root [readme](https://github.com/mattstyles/raid) for more information about how the repository is structured.

## License

MIT
