
# Creating References

In order to use the data we need ways to access the data and Raid exposes three, each accepting a string or an array of strings which represent the key path used to traverse the tree and grab the data.

## Dereferences

`state.get`

By default Raid will traverse the tree using cursors and references but when you actually want to query the data you will usually have to *unwrap* that cursor by dereferencing the node it represents.

```js
import { State } from 'raid'

const state = new State({
  foo: 'foo'
})

console.log( state.get([ 'root', 'foo' ]) )

// 'Foo'
```

Derefences are immutable which means they are great for passing to your presentational components.

## Cursors

`state.cursor`

Cursors are themselves immutable but they trigger a change event which recreates the state tree, meaning that they can be used to update values in the tree.

```js
import { State } from 'raid'

const state = new State({
  foo: 'foo'
})

console.log( state.get( 'root' ) )
// Map { foo: 'foo' }

const cursor = state.cursor( 'root' )
cursor.update( 'foo', foo => 'bar' )

console.log( state.get( 'root' ) )
// Map { foo: 'bar' }
```

The following example highlights the immutability of cursors and how the data they points to is similarly immutable. Even after an update the data that `oldCursor` points to has not been mutated, although the state tree has.

```js
import { State } from 'raid'

const state = new State({
  foo: 'foo'
})

console.log( state.get( 'root' ) )
// Map { foo: 'foo' }

const oldCursor = state.cursor( 'root' )
console.log( oldCursor.get( 'foo' ) )
// 'foo'

oldCursor.update( 'foo', foo => 'bar' )

// This mutation has resulted in a new state tree and an 'update' event
// oldCursor has not changed, even though the structure has
console.log( oldCursor.get( 'foo' ) )
// 'foo'

const newCursor = state.get( 'root' )
console.log( newCursor.get( 'foo' ) ))
//'bar'
```

The cursors used are from the [immutableJS repo](https://github.com/facebook/immutable-js/blob/master/contrib/cursor/index.js).

If you are using React then passing cursors down the state tree from parents to children ensures that they are fresh but allows code within the components to alter the state whilst still enforcing top-down rendering.

## References

References to state tree nodes provide a way to access data that is always fresh. Whenever you request a cursor from a reference it will be pointing to a fresh representation of the state tree

```js
import { State } from 'raid'

const state = new State({
  foo: 'foo'
})

console.log( state.get( 'root' ) )
// Map { foo: 'foo' }

const ref = state.reference( 'root' )
console.log( ref.cursor() )
// Cursor { foo: 'foo' }

console.log( ref.cursor( 'foo' ).deref() )
// 'foo'

ref.cursor().update( 'foo', foo => 'bar' )

console.log( ref.cursor() )
// Cursor { foo: 'bar' }

console.log( ref.cursor( 'foo' ).deref() )
// 'bar'
```

As references always return fresh cursors they are good candidates to use in stores; by using reference cursors you can pass only specific subtrees to stores and not have to worry about whether data is stale or not, simply grab a cursor from the reference when you need it.

## Next Steps

Now that we’ve got around creating an initial state and grabbing data from the state structure, we better learn about how to make changes to data and [respond to those changes](responding-to-changes.html).
