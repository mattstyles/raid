
import immstruct from 'immstruct'
import CONSTANTS from './constants'

class AppState {
    constructor() {

        this.state = immstruct( 'app', {
            [ CONSTANTS.COMPONENTS ]: {}
        })
    }
}

export default new AppState()
