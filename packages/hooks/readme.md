
# @raid/hooks

> React hooks that link in to raid signals and streams

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/@raid/hooks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Raid Documentation](https://mattstyles.github.io/raid/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid @raid/hooks
```

```sh
npm i -S raid @raid/hooks
```

Raid helps to manage state throughout your application and these hooks help you to manage the signals and streams that raid exposes to allow your application to react to changes over time to that state.

## Hooks

### useSignal (supplied signal)

```
<Function {Raid.Signal, options:Object}> => { state:Object, emit: Function }
```

`useSignal` can attach to a signal and returns the state passing through the signal as well as an `emit` function to send messages to the signal.

```js
const Posts = () => {
  const { state, emit } = useSignal(signal)

  return (
    <>
      {state.posts.map(post => <Post {...post} />)}
      <SubmitPost onSubmit={text => emit({ type: 'createPost', payload: text })}
    </>
  )
}
```

The `useSignal` hook also accepts an options argument:

```
options {
  selector: Function(state: Object)
}
```

A `selector` function can be used to transform the state coming out of the signal and supplying it in the return from the hook:

```js
const Posts = () => {
  const { posts, emit } = useSignal(signal, {
    selector: state => filter(post => post.isSubmitted)(state.posts)
  })

  return (
    <>
      {posts.map(post => <Post {...post} />)}
      <SubmitPost onSubmit={text => emit({ type: 'createPost', payload: text })}
    </>
  )
}
```

The ‘supplied’ form of `useSignal` is where a signal is supplied as the first parameter. However, this parameter is optional and, if omitted, the hook will attempt to find a signal in context.

### useSignal (context)

If the `signal` parameter is omitted then `useSignal` will attempt to find a signal from the context. You can place a signal into the context by using a `SignalProvider`:

```js
const App = () => {
  return (
    <SignalProvider signal={signal}>
      <Posts />
    </Signal>
  )
}
```

The Provider form works in the same way as manually supplying a signal to the `useSignal` hook and outputs the state (after any transform by a selector function) and an emit function to send messages to the signal.

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
