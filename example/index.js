
import React from 'react'
import ReactDOM from 'react-dom'

import Immreact from '../lib'

var state = new Immreact.State( 'app', {
    count: 0
})
window.state = state

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

    onAdd = () => {
        this.props.state.cursor( 'count' ).update( cursor => {
            return ++cursor
        })
    }

    onRemove = () => {
        this.props.state.cursor( 'count' ).update( cursor => {
            return --cursor
        })
    }

    render() {
        return (
            <div>
                <Counter count={ this.props.state.get( 'count' ) } />
                <button onClick={ this.onAdd }>Add</button>
                <button onClick={ this.onRemove }>Remove</button>
            </div>
        )
    }
}

// Kick off
render()
