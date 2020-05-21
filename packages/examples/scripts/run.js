#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    o: 'open'
  }
})
const inquirer = require('inquirer')
const { run } = require('speedrun')

const basepath = path.join(__dirname, '../')
const expath = path.join(basepath, 'examples')
const addIndex = p => path.join(p, 'index.js')

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
  const entry = addIndex(path.join('./examples', example))

  run({
    entry: entry,
    autoOpen: argv.open
  })
}
