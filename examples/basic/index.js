
import React from 'react'
import ReactDOM from 'react-dom'

import Immreact from '../../lib'

var state = new Immreact.State( 'app', {
    count: 0
})

function render() {
    ReactDOM.render( <App state={ state.cursor( 'app' ) } />, document.querySelector( '.js-main' ) )
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

class Controls extends React.Component {
    constructor( props ) {
        super( props )
    }

    onAdd = () => {
        this.props.count.update( cursor => {
            return ++cursor
        })
    }

    onRemove = () => {
        this.props.count.update( cursor => {
            return --cursor
        })
    }

    render() {
        return (
            <div>
                <h3>Using cursor passed as props</h3>
                <button onClick={ this.onAdd }>Add</button>
                <button onClick={ this.onRemove }>Remove</button>
            </div>
        )
    }
}

/**
 * This is an anti-pattern for the pure render function as to check pure functions
 * the shouldUpdate function checks diffs against props, as this component has no
 * props, choosing instead to grab stuff from outside, it will fail the diff check
 * and remain unrendered even though the data controlling it has changed and the
 * global render function has recalled.
 *
 * Given that this.count only references the point in time at instantiation, this
 * will never be in sync once interactions have occurred on the props cursor above.
 * This could be solved by using a reference cursor possibly.
 */
class StateControls extends React.Component {
    constructor( props ) {
        super( props )

        this.count = state.cursor([ 'app', 'count' ])
    }

    onAdd = () => {
        // Immutability being what it is, if you want this component to reflect the
        // current state then either update `this.count` in the render function or
        // do it here. Not sure about pure render function and setting it in render
        // as the render should probably skip without props to diff against.
        this.count = this.count.update( cursor => {
            return ++cursor
        })
    }

    onRemove = () => {
        this.count = this.count.update( cursor => {
            return --cursor
        })
    }

    render() {
        return (
            <div>
                <h3>Using state from outside</h3>
                <button onClick={ this.onAdd }>Add</button>
                <button onClick={ this.onRemove }>Remove</button>
            </div>
        )
    }
}

class Persistence extends React.Component {
    constructor( props ) {
        super( props )
    }

    onSave = () => {
        // Uses the Immreact.State instance to get the save function
        localStorage.setItem( 'state', state.save() )
    }

    onLoad = () => {
        state.load( localStorage.getItem( 'state' ) )
    }

    render() {
        return (
            <div>
                <h3>Using save and load helpers to punt state to local storage</h3>
                <button onClick={ this.onSave }>Save</button>
                <button onClick={ this.onLoad }>Load</button>
            </div>
        )
    }
}


class App extends React.Component {
    constructor( props ) {
        super( props )
    }

    render() {
        return (
            <div>
                <Counter count={ this.props.state.get( 'count' ) } />
                <Controls count={ this.props.state.cursor( 'count' ) } />
                <StateControls />
                <Persistence />
            </div>
        )
    }
}

// Kick off
render()
