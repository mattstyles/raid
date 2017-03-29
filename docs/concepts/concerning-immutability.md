
# Concerning Immutability

Immutable data structures can help us to create simpler applications by being able to rely on the state of data at any point in time. When coupled with top-down rendering suddenly we have the ability to reason about the affects our actions will take on our state and be confident that our state remains consistent across as it traverses our view layer.

Raid doesn’t try to reinvent the wheel and builds on top of the work done on [immutablejs](https://facebook.github.io/immutable-js/) and [immstruct](https://github.com/omniscientjs/immstruct) to create a centralised state implementation that emits events when it has been updated.

## *“It’s Alive!”*

If you’ve never worked with immutable data structures then getting your head around how to create changes, or *mutations*, in your data (and therefore your state in this case) is crucial in getting your application to respond to actions.

> *Immutable data structures can not be changed.*

Yep, I think we got that one.

So, when we want to our application to respond to events we need to recreate the entire state tree and pass that to our rendering to see the update of our action.

Sounds expensive right? Well, it is, or, more accurately, it can be.

ImmutableJS has done a lot of work to make this process as efficient as possible by reusing parts of the previous state tree that have not changed. There are some advantages here too in that testing for changes to your data structure becomes significantly easier, again, ImmutableJS handles this and Raid is just able to use that functionality by accepting a new state object to emit whenever you are processing an action.

## Referential Transparency

I promise the long words are going to stop soon.

Referential transparency, or, pure functions, are simply functions which produce no side effects, their output remains consistent when called with a given set of inputs and they touch only their own inputs. Use of referentially transparent functions liberally throughout an application, but in particular use in our update and render functions, can help create a predictable application by helping us to strictly manage where and how changes occur.

Having a predictable state tree is great for developers, the advantages of being able to say *"Something has changed, now render everything"* are great as we don’t have to concern ourselves with working out what changed, or even why, or how it relates to the previous state, we simply render whatever our data is currently saying. We stay firmly in the present.

Simply rendering everything whenever any change occurs is sometimes fast enough, but, ordinarily, it is a huge overdraw, which usually leads to poor rendering performance. Thankfully, there are some things we can do about that.

Raid was built with [React](https://facebook.github.io/react/) in mind and as the structure is immutable we can make some predictions about the state of the render tree and try to reduce any overdraw resulting from top-down rendering.

A quick recap on React rendering.

React implements a [virtual DOM](https://facebook.github.io/react/docs/glossary.html) and it uses this tree to make diffs and try to work out what has changed. It does this by comparing properties passed to components. Out of the box React must at least check every component to see if it has changed before deciding how to proceed, this is actually fairly fast but we can make it faster. The problem React has is that if components have their own state then we can not make predictions about child nodes based on parent props so we must evaluate every node for changes before batching only those changes that result in operations on the DOM. By moving individual component state into a centralised state and passing state through to components via render properties we can remove this restriction and employ much faster techniques to assert changes to branches of our state diagram.

An immutable state tree means that any operation on data creates a new state tree which we can evaluate from the top-down, as properties are passed from parent to child through the render tree we can make the assertion that if a parent’s properties do not change then neither have their children and skip rendering that entire subtree.

React implements this using a [pure render mixin](https://facebook.github.io/react/docs/pure-render-mixin.html) that can make this evaluation really fast, if, and only if, it can be sure that stuff further down the tree has not changed.

Raid also intones that update functions should also be pure, they are handed the state tree and an event to work against and that should be all they require to make changes to the state tree and return a new version of it. Whilst not a requirement for Raid, Immutability can help here as it will eliminate the chance of rogue state changes creeping in to our view layer when we are preparing data for render and give components freedom to make any changes they need to before preparation without risk of mutating the same data structure (or parts of a data structure) used by a different component. State becomes consistent and updates occur in one place.
