
# create-raid-app

> Code generation tooling for use with a raid-powered application

[![npm](https://img.shields.io/npm/v/create-raid-app.svg?style=flat)](https://www.npmjs.com/package/create-raid-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Getting Started

> `create-raid-app` requires node version > 8 for async support and, by default, uses `yarn` to scaffold dependencies.

Create a new package to act as the root for the project, and then run `create-raid-app` to scaffold the project:

```sh
yarn init -y
npx create-raid-app
```

Alternatively you can install `create-raid-app` either locally or globally and running `create-raid-app`. Once the project is scaffolded `create-raid-app` can be used to create additional scaffolds (such as components or signals for the project), at which point it will defer to the local version. This allows you to use a project-specific version (or even a fork).

To install globally with [npm](https://npmjs.com) use the `-g` flag, the command is the similar for [yarn](https://yarnpkg.com)

```sh
npm i -g create-raid-app
```

```sh
yarn global add create-raid-app
```

By default `create-raid-app` will install dependencies using `yarn` and will fail if it can not find `yarn` in the path. Use the `--use-npm` flag if you prefer to use `npm`

```sh
npx create-raid-app --use-npm
```

During installation `create-raid-app` will warn that a `package.json` already exists (as it wants to create a new one), hit `y` when prompted and `create-raid-app` will scaffold you a package and then process to install your dependencies.

Once a new project is scaffolded and installed a live-reloading development environment will already be running. To start it again later, use:

```sh
yarn start
```

`create-raid-app` contains some basic documentation for each instruction, use `--help` to get more details, e.g.

```sh
create-raid-app --help
create-raid-app create component --help
```

* [Getting started with raid](https://github.com/mattstyles/raid/tree/master/packages/raid)
* [Utilities and complementary functions](https://github.com/mattstyles/raid/tree/master/packages/raid-addons)
* [Input streams](https://github.com/mattstyles/raid/tree/master/packages/raid-streams)
* [Typed actions](https://github.com/mattstyles/raid/tree/master/packages/raid-fl)
* [Documentation](https://mattstyles.github.io/raid/)

## Example project structure

`create-raid-app` is necessarily opinionated about how you structure your application and the additional code generation tools will expect you to adhere to this structure.

Unlike [create-react-app](https://www.npmjs.com/package/create-react-app) (which was clearly an inspiration) the build process that is scaffolded with the initial application is inlined in to your project, whilst this provides some additional bloat to your project it realises that many projects differ and small changes to the build processes becomes trivial by making them live with your project. If you never need to touch the build then there is no requirement to do so, everything will work out-of-the-box.

```
.
├── package.json
├── yarn.lock
├── readme.md
├── spec
└── src
    ├── assets
    ├── components
    │   ├── app.js
    │   ├── navigation.js
    │   └── title.js
    ├── core
    │   ├── routing
    │   │   ├── index.js
    │   │   └── routes.js
    │   ├── actions.js
    │   ├── constants.js
    │   ├── selectors.js
    │   └── updates.js
    ├── signals
    │   └── index.js
    ├── utils
    │   └── index.js
    ├── views
    │    └── home.js
    ├── index.html
    └── main.js
```

Best way to get started is to run `create-raid-app` and have it scaffold a project for you. Be sure to also try `create-raid-app create component`, use `--help` to get more information.

`create-raid-app` very consciously sets up a fairly minimal project structure, as each project is unique so are it’s requirements as it grows, initially all `create-raid-app` wants is for you to get up and running fast. When (if?) your project specifics start to form and the above structure is no longer viable then it may be time to extend `create-raid-app` with additional features, see the next section on extending `create-raid-app`.

## Extending `create-raid-app`

There is no formal configuration for `create-raid-app` and it wants to remain as easy to use as possible, this leaves forking as the simplest solution to creating a different base scaffold process or adding additional commands that may be unique to your application, structure and preferences.

As the `create-raid-app` global (or using via `npx`) defers to any local version if you install a specific fork in to your `node_modules` then `create-raid-app` will continue to work as you need.

See the existing `create-raid-app` structure for examples of how to create your own commands and templates.

## Hot module reloading

HMR moves your development builds further away from production builds which can lead to very hard-to-trace bugs surfacing in production without very careful testing (in the best case it can lead to head-scratching about why tests fail but locally you’re all good).

True incremental HMR is disabled by default for CRA scaffolded projects. This is in-line with latest builds of [Parcel](https://parceljs.org/hmr.html). You will still get page reloading out of the box and with Parcel’s aggressive incremental caching this can still get you a lightning fast feedback loop between saving your files and seeing the changes running.

HMR is particularly sensitive to files that generate side effect. Raid supports a single store, which inherently generates side effects in some files. These files are often root files and so are liable to be reloaded for any changes further down the tree. This isn’t the only way to use Raid and so if you’re happy you know _which_ updates are safe and which aren’t then you can enable incremental HMR.

The default stance (for create-raid-app) is that true HMR generates more problems than it solves for the majority of projects (a sentiment echoed by the latest Parcel changes) and so is disabled by default as of `cra@6.0.1`.

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `yarn test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

## License

MIT
