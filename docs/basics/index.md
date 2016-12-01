
# The Ropes

> Everything should be made as simple as possible, but no simpler
>
> -- <cite>Albert Einstein</cite>

Raid strives to be unobtrusive, it is little more than a stream that accepts action intents, performs updates to a data structure and then emits that structure so that a view layer can present the data.

That’s it.

That’s all it does.

It massages data and emits events when changes occur.

Do one thing and do it well.

The pattern Raid builds upon has a few advantages:

* It’s simple, the learning curve for Raid is shallow, although some knowledge of functional programming is helpful.
* Updating the state tree happens via update functions, separating presentational and business logic. Whilst immutable data structures are not required they do fit well with this pattern.
* Your view layer becomes dumb, simply concerned only with it’s presentational logic. To manage data the views should emit events.

---

Jump to the [getting started](getting-started.html) section if you’re comfortable with the principles behind Raid.

* [Starting to Walk](starting-to-walk.html)
