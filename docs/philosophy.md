
# Philosophy

* [Small module philosophy](http://substack.net/how_I_write_modules): Raid aims to do just one thing well, namely, create an event stream that holds state in a fold function, away from untimely mutation.
* **Standing on the shoulders of giants**: Raid builds on other modules which do one core thing well.
* [OPEN open source](https://github.com/Level/community/blob/master/CONTRIBUTING.md): if it works its because a community makes it work. There’s no arrogance here.
* **Keep the complex away from the consumer**: Raid should make life easier for developers by being both ergonomic and performant. As far as the developer is concerned, they should just use the library, not have to learn a load of confusing concepts.
* **Unobtrusive**: how you structure your application should always be up to you as a development team,  Raid tries to help you create good patterns, but, ultimately, the best patterns for your application require domain knowledge. Raid just handles state changes, you handle how and where those changes occur.
