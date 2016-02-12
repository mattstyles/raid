
# Initial State

In line with being unobtrusive the state tree structure is up to you, infact, it needn’t even be a tree.

## `root` node

You can define roots in the constructor, or, Raid will create one for you, helpfully called `root`.

```js
import { State } from 'raid'

const state = new State()

console.log( state.get() )
```

```js
{
  _components: Map {},
  root: Map {}
}
```

The `_components` map is to hold internal component state and can safely be igonred at the moment. The only thing worth mentioning is that changes to the `_component` map are the only place where an update will be silent, changes to its children will still emit. The `_component` map is really meant for Raid to manipulate.

## Specifying root node name

You can specify an initial root name by passing a string to the constructor

```js
import { State } from 'raid'

const state = new State( 'app' )

console.log( state.get() )
```

```js
{
  _components: Map {},
  app: Map {}
}
```

## Passing an initial state representation

You pass the constructor an object to use as the initial state, it needn’t be an immutable structure, Raid will do the conversion for you

```js
import { State } from 'raid'

const state = new State({
  foo: 'foo'
})

console.log( state.get() )
```

```js
{
  _components: Map {},
  root: Map {
    foo: 'foo'
  }
}
```

## Naming and passing initial state

You can pass a string and an initial state too

```js
import { State } from 'raid'

const state = new State( 'app', {
  foo: 'bar'
})

console.log( state.get() )
```

```js
{
  _components: Map {},
  app: Map {
    foo: 'bar'
  }
}
```

## Using `.create` to create new roots

All the constructor does is call the `.create` function so if you wanted to create an additional roots then use `.create`

```js
import { State } from 'raid'

const state = new State()
state.create( 'app', {
  baz: 'baz'
})

console.log( state.get() )
```

```js
{
  _components: Map {},
  root: Map {},
  app: Map {
    baz: 'baz'
  }
}
```

## Next Steps

Now that we have an initial state of our application populated it is worth knowing how to [create references](creating-references.md) to parts of it.
