
import immstruct from 'immstruct'
import CONSTANTS from './constants'

class AppState {
    constructor() {
        this.state = immstruct( 'app', {
            [ CONSTANTS.COMPONENTS ]: {}
        })
    }

    /**
     * Creates a new root level immutable and returns a ref to it
     * param key <String> _required_
     * param base <Object> _optional_ defaults to {}
     */
    create( key, base: ?object ) {
        if ( !key ) {
            throw new Error( 'No key specified when creating new appState root' )
        }

        // @TODO should check if key already exists

        this.state.cursor().update( cursor => {
            return cursor.merge({
                [ key ]: base || {}
            })
        })

        return this.state.reference( key )
    }
}

export default new AppState()
