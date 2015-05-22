
import React from 'react'
import appState from './state'


export default class Component extends React.Component {
    static propTypes = {
        cursor: React.PropTypes.object
    }

    static defaultProps = {
        cursor: null
    }

    constructor( props ) {
        super( props )

        this._state = null
    }

    set state( state ) {
        console.log( 'setting state' )
        if ( !state ) {
            // @TODO should throw
            return console.warn( 'Immreact.Component state unspecified' )
        }

        this.setState( state )
    }

    get state() {
        return this._state
    }

    setState( state ) {
        let cursor = this.props
            ? this.props.cursor || appState.state.cursor()
            : appState.state.cursor()

        this._state = cursor.update( curs => {
            return curs.merge( state )
        }).toJS()
    }
}
