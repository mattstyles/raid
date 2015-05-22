
import React from 'react'
import appState from './state'

var _state = Symbol( 'state' )


export default class Component extends React.Component {
    static propTypes = {
        cursor: React.PropTypes.object
    }

    static defaultProps = {
        cursor: null
    }

    constructor( props ) {
        super( props )

        this[ _state ] = appState.state.reference()
    }

    set cursor( state ) {
        if ( !state ) {
            // @TODO should throw
            return console.warn( 'Immreact.Component state unspecified' )
        }

        this.setCursor( state )
    }

    get cursor() {
        return this[ _state ].cursor()
    }

    update( state ) {
        // let cursor = this.props
        //     ? this.props.cursor || appState.state.cursor()
        //     : appState.state.cursor()
        //
        // this._state = cursor.update( curs => {
        //     return curs.merge( state )
        // })
        console.log( 'setting state' )
        console.log( state )
        try {
            console.log( state.toJS() )
        } catch( err ) {

        }
        this[ _state ].cursor().update( cursor => {
            return cursor.merge( state )
        })
    }
}
