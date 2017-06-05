#!/usr/bin/env node

var path = require('path')
var fs = require('fs')

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    o: 'open'
  }
})
var inquirer = require('inquirer')
var budo = require('budo')

const basepath = path.resolve(__dirname, '../')
const expath = path.join(basepath, 'examples')
const packages = path.join(basepath, 'packages')

function getDirectory (file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        return reject(err)
      }
      stats.isDirectory()
        ? resolve(file)
        : resolve(false)
    })
  })
}

fs.readdir(expath, (err, files) => {
  if (err) {
    return console.error(err)
  }

  Promise.all(files
    .map(file => path.join(expath, file))
    .map(getDirectory))
    .then(directories => directories.filter(d => d))
    .then(directories => directories.filter(d => !/^_/.test(path.basename(d))))
    .then(examples => examples.map(e => path.basename(e)))
    .then(exampleSelect)
    .catch(e => {
      console.error(e)
    })
})

function exampleSelect (examples) {
  if (!examples || !examples.length) {
    return console.error('No examples found')
  }

  inquirer.prompt([{
    type: 'list',
    name: 'example',
    message: 'Please select an example:',
    default: examples[0],
    choices: examples
  }])
    .then(answers => {
      spawnServer(answers.example)
    })
}

function spawnServer (example) {
  let dir = path.resolve(expath, example)
  let paths = [
    dir,
    packages
  ]
  // Set babel env to switch jsx compilation
  if (/adaptor|resize|navigator|screen/.test(example)) {
    process.env.BABEL_ENV = 'react'
  }
  // if (/navigator/.test(example)) {
  //   process.env.BABEL_ENV = 'inferno'
  // }
  budo(dir + '/index.js', {
    live: true,
    dir,
    watchGlob: paths,
    browserify: {
      paths
    },
    open: argv.open,
    verbose: true,
    stream: process.stdout,
    host: '0.0.0.0',
    pushstate: true
  })
}
