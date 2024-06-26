
# 7.x

* :house: use changesets instead of manual changelog updating

# 6.1.1

* _fix_ keystream log

# 6.1.0

* _prep_ shift to rollup builds
* _update_ navigator remove lodash dependency, navigator is getting skinnier
* _update_ navigator::history update history dependency to v5
* _add_ addons::patch third param which is the full state object

# 6.0.1

* _fix_ CRA self dependency
* _fix_ common issues with HMR fixed by removing incremental HMR

# 6.0.0

* _add_ Raid streams now accept a type parameter
* _add_ Raid streams now exposes an element observer
* _update_ Raid screen stream scroll observer only attaches to window
* _add_ mount signals (in addition to streams)
* _prep_ hoist dev dependencies to root
* _update_ move examples to their own package
* _add_ Raid::Signal.current exposes the last value through the stream
* _add_ Raid::Signal::apply
* _add_ Hooks::useSignal
* _add_ Observing a Raid::Signal now triggers the observer with the last source stream value
* _add_ allow detaching connected functions from a signal
* _add_ detach observers from a stream
* _add_ cra project description prompt
* _add_ cra accessibility additions
* _fix_ correct addon peer deps
* _add_ addons have individual exports, all named
* _remove_ sin has finished deprecation, and is now removed

## Breaking changes

* _breaking_ raid::Signal.observer API change
* _breaking_ raid::Signal.register API change
* _breaking_ raid::Signal.mount return value change
* _breaking_ @raid/addons::sin removed
* _breaking_ @raid/streams::keyup API change
* _breaking_ @raid/streams::keydown API change
* _breaking_ @raid/streams::resize API change
* _breaking_ @raid/streams::scroll API change
* _breaking_ @raid/navigator::storage defaults to null

### raid::Signal.observe

`Raid::Signal::observe` no longer accepts a subscription object as first parameter, instead this is moved to an options object. This means that the `observe` (and `subscribe` alias) method is no longer overloaded and will only accept the following signature:

```
Signal.observe(
  next: Function,
  error: Function,
  options: Object
)
```

```
options {
  key: String,
  subscription: Object
}
```

If a subscription object is applied then it will take precedence over any supplied `next` and/or `error` functions.

This API change encourages consumers to attach an error function whilst allowing a subscription object to still be applied should a consumer prefer that API.

To adhere to the new API:

Object-based subscription:

```js
// Previously
signal.observe({
  next: fn,
  error: fn
})

// v6
signal.observe(null, null, {
  subscription: {
    next: fn,
    error: fn
  }
})
```

Applying a key to a subscription:

```js
// Previously
signal.observe(fn, key)

// v6
signal.observe(fn, { key })
```

If you previously used to apply next and/or error functions, these will still work as before:

```js
// Previously
signal.observe(fn, errorFn)

// v6 *no change*
signal.observe(fn, errorFn)
```

### raid::Signal.register

`register()` follows the API change to now accept an options object, which can be used to specify a key for the update function that is being registered.

```js
// Previously
signal.register(fn, key)

// v6
signal.register(fn, { key })
```

This is to keep it inline with `observe` and open up more opportunities in the future.

### raid::Signal.mount

Mount previously returns the response from calling `observe` on the stream passed to `mount`, however, this was not always useful (it is often null) and could not be used to "unmount" a stream.

v6 solves this problem by calling the streams subscribe method, which, if implemented as per the [Observable proposal](https://tc39.es/proposal-observable/), returns a subscription object which can be used to unsubscribe from future events leaving the stream.

v6 additionally allows `mount` to be used with a Signal, whereby the source Signal will receive events passing through the mounted Signal. Mounting a signal has a slightly different implementation to attaching directly to a stream, so the return value differs and is not a subscription object, but a function which can be called to unmount the signal.

```js
const subscription = signal.mount(stream)

subscription.unsubscribe()
```

```js
const unmount = signal.mount(anotherSignal)

unmount()
```

### @raid/streams::keyup @raid/streams::keydown

Both `keyup` and `keydown` change in the same way and both now place the required key [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) as the first parameter, and an options object as an optional second parameter.

```js
// Previously
keyup({ keys: new Map() })
keydown({ keys: new Map() })

// v6
keyup(keys: new Map())
keydown(keys: new Map())
```

Note that `keystream`, which has only optional parameters, has the same API (accepts one parameter, an optional object describing the configuration).

### @raid/streams::resize

Resize previously accepted an `el` property but this is mostly redundant. It is now removed and resize will **only** connect to `window`.

### @raid/streams::screen::scroll

Scroll (as part of `screen`) no longer accepts an `el` property and always attaches to the window.

The previous behaviour, where an element can be specified is maintained, but it has moved to `@raid/streams/element`.


### @raid/navigator::storage

Storage now defaults to null and not `window.sessionStorage`. This is a clearer API than trying to guess the intention of the consumer.


# 5.0.2

* _fix_ react import, enabling preact compatibility
* _update_ build scripts and examples

# 5.0.1

* _update_ dependencies
* _fix_ cra title styling

# 5.0.0

* _update_ cra template to include @raid/ui projects
* _add_ side effect free hints
* _add_ cra uses yarn by default, with flag to switch to npm

* _breaking_ Changed package names to be under the @raid project

List of changed package names:

`raid`: <unchanged> `raid`
`create-raid-app`: <unchanged> `create-raid-app`
`raid-addons`: `@raid/addons`
`raid-fl`: `@raid/fl`
`raid-streams`: `@raid/streams`
`raid-navigator`: `@raid/navigator`

# 4.1.0

* _update_ cra dependencies

# 4.0.0

* _fix_ React casing issue with adaptor
* _prep_ Internal organisation. Examples use parcel. Yarn makes the monorepo easier to manage.
* _update_ create-raid-app root template
* _fix_ create-raid-app root template navigation issue

* _breaking_ Changed API for raid-addons:keyup and keydown to be single arity with an `el` property for selecting which element to target.

**Previous:**

```js
const keyMap = new Map()
keyup(keyMap)
```

**Now:**

```js
const keyMap = new Map()
keyup({
  keys: keyMap
})
```

# 3.5.0

* _update_ all dependencies
* _add_ raid-streams:keystream keypress repeat rate option
* _add_ raid-streams:keystream element select option

# 3.4.0

* _add_ raid-addons:plug
* _add_ raid-addons:lock
* _add_ private create adaptor for adaptor and plug
* _fix_ compress passes through params for arc correctly
* _fix_ patch and arc compatibility
* _add_ arc tests using async/await

# 3.3.2

* _fix_ navigator:routeMatcher default export

# 3.3.1

* _fix_ tag and publish

# 3.3.0

* _update_ remove deprecation on lifecycle methods within `Navigator`
* _update_ dependency updates

# 3.2.0

* _add_ navigator to cra template
* _update_ cra component template
* _fix_ cra as a dependency of the template to ensure it isn’t reinstalled and changes the version number

# 3.1.0

* _update_ create-raid-app dependencies
* _add_ colours to cra output
* _add_ debug to cra output
* _update_ cra template to use parcel bundler

# 3.0.2

* _update_ all dependencies

# 3.0.1

* _update_ navigator peer dependencies

# 3.0.0

> Breaking Change

* _update_ babel 7
* _update_ examples
* _remove_ unnecessary dependencies from raid-streams

# 2.13.0

* _add_ raid:Signal:disposeAll
* _add_ navigator can wrap a navigation stack in a component
* _add_ navigator allows passing a function to map over children

# 2.12.0

* _add_ navigator can now match on starred routes
* _add_ navigator:RouteMatcher
* _update_ raid-fl interop with build tooling documentation

# 2.11.0

* _add_ raid-fl type and untype events transform helpers
* _add_ raid-addons:debug

# 2.10.0

* _add_ raid-addons:match
* _add_ raid-fl for typed actions
* _update_ create-raid-app dependencies
* _update_ create-raid-app react@16 and styled-jsx@2
* _add_ raid-fl to create-raid-app
* _add_ Signal.of

# 2.9.0

* _add_ create-raid-app
* _update_ docs deploy script
* _fix_ remove inferno dep warning

# 2.8.0

* _update_ event stream structure
* _add_ raid-addons:scope
* _update_ example structure and helpers
* _update_ use React as common for examples
* _update_ flatten raid-stream output

# 2.7.0

* _add_ npm 5 as first class, so package locks
* _add_ raid-streams:key sequences
* _add_ raid-streams:tick streams
* _update_ raid-addons:safe can emit falsy values

# 2.6.0

* _add_ navigator matches multiple children
* _add_ navigator—match route parameters

# 2.5.0

* _update_ increase raid-navigator test coverage
* _add_ raid-navigator route matching
* _add_ raid-navigator memory history example
* _add_ auto setup navigator on mount
* _update_ specify storage method for navigator

# 2.4.0

* _add_ raid-navigator
* _add_ combine coverage reports from packages
* _update_ raid-addons:adaptor selection check

# 2.3.0

* _add_ raid:mount
* _add_ raid-streams
* _add_ raid-addons:patch
* _update_ lerna concurrency

# 2.2.0

* _add_ raid-addons
* _add_ hook, flow, squash, compress, safe and adaptors
* _add_ arcs
* _update_ documentation
* _update_ use React instead of Inferno for adaptor examples
* _add_ lerna monorepo
* _update_ increase test coverage

# 2.1.1

* _fix_ propagate errors without error handler issue
* _add_ getting started documentation
* _add_ extra tests for state mutation inside updates

# 2.1.0

* _add_ create observable object-form
* _add_ propagate stream errors
* _add_ delay triggers to allow update triggers
* _add_ action intents
* _update_ terminology documentation
* _update_ intro docs

# 2.0.0

* _add_ signals as observables
* _add_ helper to access examples
