
#

* _add_ cra project description prompt
* _add_ cra accessibility additions
* _fix_ correct addon peer deps
* _add_ addons have individual exports, all named
* _remove_ sin has finished deprecation, and is now removed

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
