
# Immutability

Immutable data structures can help us to create simpler applications by being able to rely on the state of data at any point in time, coupled with top-down rendering and suddenly we have the ability to reason about the affects our actions will take on our state.

Raid doesn’t try to reinvent the wheel and builds on top of the work done on [immutablejs](https://facebook.github.io/immutable-js/) and [immstruct](https://github.com/omniscientjs/immstruct) to create a state tree implementation that allows components to *pinch* the parts of the state tree they require whilst still having a centralised location to watch for changes.

## *“It’s Alive!”*

If you’ve never worked with immutable data structures then getting your head around how to create changes, or *mutations*, in your data (and therefore your state in this case) is crucial in getting your application to respond to actions.

*Immutable data structures can not be changed.*

Yep, I think we got that one. So, when we want to our application to respond to events we need to recreate the entire state tree and pass that to our rendering to see the update of our action. Immutablejs provides a mutative API that yields a new state tree whenever we make changes, the Raid state tree then reports those operations to allow you to pass the state tree to your rendering.

We'll go through some concrete examples of mutative changes to our state tree later, but we should probably just touch on performance first.

## Referential Transparency

I promise the long words are going to stop soon.

Having a predictable state tree is great for developers, the advantages of being able to say *"Something has changed, now render everything"* are great as we don’t have to concern ourselves with working out what changed, or even why, or how it relates to the previous state, we simply render whatever our data is currently saying. We stay firmly in the present.

Simply rendering everything whenever any change occurs is sometimes fast enough, but, ordinarily, it is a huge overdraw, which usually leads to poor rendering performance. Thankfully, there are some things we can do about that.

Raid was built with [React](https://facebook.github.io/react/) in mind and as the structure is immutable we can make some predictions about the state of the render tree and try to reduce any overdraw resulting from top-down rendering.

A quick recap on React rendering.

React implements a [virtual DOM](https://facebook.github.io/react/docs/glossary.html) and it uses this tree to make diffs and try to work out what has changed. It does this by comparing properties passed to components. Out of the box React must at least check every component to see if it has changed before deciding how to proceed, this is actually fairly fast but we can make it faster. The problem React has is that if components have their own state then we can not make predictions about child nodes based on parent props so we must evaluate every node for changes before batching only those changes that result in operations on the DOM. With immutable data we can help to remove side-effects and remove this restriction.

An immutable state tree means that any operation on data creates a new state tree which we can evaluate from the top-down, as properties are passed from parent to child through the render tree we can make the assertion that if a parent’s properties do not change then neither have their children and skip rendering that entire subtree.

React implements this using a [pure render mixin](https://facebook.github.io/react/docs/pure-render-mixin.html) that can make this evaluation really fast, if, and only if, it can be sure that stuff further down the tree has not changed.

Raid strives for pure render functions (referential transparency) whilst still giving you the option to employ internal state. The solution is that internal state is represented in the application state tree and any manipulation to it garners a new tree which is then rendered. Raid uses cursors to allow components access to only very specific parts of the state tree.
