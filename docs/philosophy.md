
# Philosophy

* [Small module philosophy](http://substack.net/how_I_write_modules) - Raid aims to do just one thing well, namely, create an immutable state tree that lets you know when a new version has been created.
* **Standing on the shoulders of giants** - It builds on other modules which do one core thing well, using them to meet its goal.
* [OPEN open source](https://github.com/Level/community/blob/master/CONTRIBUTING.md) - if it works its because a community makes it work. There’s no arrogance here.
* **Keep the complex away from the consumer** - Raid should make life easier for developers by being both ergonomic and performant. As far as the developer is concerned, they should just use the library, not have to learn a load of confusing concepts. It reminds you it’s immutable data by using cursors, beyond that you should just assume you can make changes and the library takes care of working out the hows and whys, you just let your UI re-render.
* **Unobtrusive** - besides using immutable data how you structure your application should be up to you. Raid tries to help you create good patterns, but, ultimately, the best patterns for your application require knowledge of your application. Raid just handles state changes, you handle how and where those changes occur.
