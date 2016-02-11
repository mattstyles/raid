
import state from './state'
import { Record } from 'immutable'

const UserRecord = new Record({
  uid: '',
  name: '',
  image: ''
})

const INITIAL_NUM = 20

class Store {
  constructor( userstate ) {

    this.data = null
    this.userstate = userstate

    fetch( '/data.json' )
      .then( res => res.json() )
      .then( data => {
        this.data = data
        this.add( INITIAL_NUM )
      })
  }

  add = ( num ) => {
    var users = []
    for( let i = 0; i < INITIAL_NUM; i++ ) {
      users.push( new UserRecord({
        uid: Math.random().toString( 36 ).substring( 2 ),
        name: this.data.names[ Math.random() * this.data.names.length | 0 ],
        image: this.data.images[ Math.random() * this.data.images.length | 0 ]
      }))
    }

    this.userstate.cursor().update( cursor => {
      return cursor.concat( users )
    })
  };

}

export default new Store( state.reference([ 'root', 'users' ]) )
