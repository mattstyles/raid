
import React from 'react'
import ReactDOM from 'react-dom'

import Immreact from '../lib'

var state = new Immreact.State( 'app', {
    count: 0
})

function render() {
    ReactDOM.render( <App state={ state.cursor().get( 'app' ) } />, document.querySelector( '.js-main' ) )
}

state.on( 'update', render )


class Counter extends React.Component {
    constructor( props ) {
        super( props )
    }

    render() {
        return (
            <h1>Count <span>{ this.props.count }</span></h1>
        )
    }
}


class App extends React.Component {
    constructor( props ) {
        super( props )
    }

    render() {
        return (
            <Counter count={ this.props.state.cursor( 'count' ).deref() } />
        )
    }
}

// Kick off
render()
