
import immstruct from 'immstruct'

class AppState {
    constructor() {

        this.state = immstruct( 'app', {} )
    }
}

export default new AppState()
