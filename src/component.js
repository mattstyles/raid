
import React from 'react'
import appState from './state'
import CONSTANTS from './constants'
import uuid from 'uuid'

var _state = Symbol( 'state' )
var _id = Symbol( 'id' )


export default class Component extends React.Component {
    static propTypes = {
        cursor: React.PropTypes.object
    }

    static defaultProps = {
        cursor: null
    }

    constructor( props ) {
        super( props )

        // Be lazy, dont create symbols on the object unless required
    }

    set cursor( state ) {
        if ( !state ) {
            // @TODO should throw
            return console.warn( '[Immreact.Component] state unspecified' )
        }

        if ( !state.id ) {
            return console.warn( '[Immreact.Component] can not create cursor without id' )
        }

        // Only generate stateful container if cursor is defined
        // Id also serves as an indicator of being linked to centralised state
        // this[ _id ] = uuid.v4()
        this[ _id ] = state.id

        // Add new stateful container to the components map
        appState.state.cursor( CONSTANTS.COMPONENTS ).update( cursor => {
            // @TODO many components being created at the same time will repeatedly
            // trigger immstruct swap events, can this be batched? The call to this.update
            // triggers another swap
            return cursor.merge({
                [ this[ _id ] ]: {}
            })
        })

        // console.log( 'fresh state using cursor = {...}' )
        this.update( state )
    }

    get cursor() {
        if ( !this[ _id ] ) {
            // @TODO should throw?
            return console.warn( '[Immreact.Component] component has no cursor set, can not access' )
        }

        // Lazily reference the state and cache, update when the reference changes
        // if ( !this[ _state ] ) {
        //     this[ _state ] = appState.state.reference([ CONSTANTS.COMPONENTS, this[ _id ] ] )
        // }

        // Grab a fresh cursor to the referenced data
        return appState.state.cursor([ CONSTANTS.COMPONENTS, this[ _id ] ] )
    }

    update( state ) {
        // console.log( 'setting state' )
        // console.log( state )

        if ( state.id ) {
            delete state.id
        }

        this.cursor.update( cursor => {
            return cursor.merge( state )
        })
    }
}
