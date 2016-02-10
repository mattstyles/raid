#!/usr/bin/env node

var path = require( 'path' )
var fs = require( 'fs' )

var argv = require( 'minimist' )( process.argv.slice( 2 ) )
var inquirer = require( 'inquirer' )
var budo = require( 'budo' )
var babelify = require( 'babelify' )

function getDirectory( file ) {
  return new Promise( ( resolve, reject ) => {
    fs.stat( file, ( err, stats ) => {
      if ( err ) {
        return reject( err )
      }
      stats.isDirectory()
        ? resolve( file )
        : resolve( false )
    })
  })
}

fs.readdir( __dirname, ( err, files ) => {
  if ( err ) {
    return console.error( err )
  }

  Promise.all( files
    .map( file => path.join( __dirname, file ) )
    .map( getDirectory ) )
    .then( directories => directories.filter( d => d ) )
    .then( directories => directories.filter( d => !/^_/.test( path.basename( d ) ) ) )
    .then( examples => examples.map( e => path.basename( e ) ) )
    .then( exampleSelect )
    .catch( e => {
      console.error( e )
    })
})

function exampleSelect( examples ) {
  if ( !examples || !examples.length ) {
    return console.error( 'No examples found' )
  }

  inquirer.prompt([
    {
      type: 'list',
      name: 'example',
      message: 'Please select an example:',
      default: examples[ 0 ],
      choices: examples
    }
  ], answers => {
    spawnServer( answers.example )
  })
}

function spawnServer( example ) {
  budo( path.resolve( __dirname, example ), {
    live: true,
    watchGlob: [
      path.join( __dirname ),
      path.join( __dirname, '../lib' )
    ],
    open: argv.o || argv.open || false,
    verbose: true,
    stream: process.stdout
  })
}
