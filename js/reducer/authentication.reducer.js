import { userConstants } from '../constant'
import { Map } from 'immutable'

let user = JSON.parse(sessionStorage.getItem('user'))
const initialState = user ? Map({ loggedIn: true, user: user }) : Map({ loggedIn: false, user: {} })

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return state.set('loggingIn', true)
        .set('user', action.user)
        .set('loggedIn', false)
    case userConstants.LOGIN_SUCCESS:
      return state.set('loggingIn', false)
        .set('loggedIn', true)
        .set('user', action.user)
    case userConstants.LOGIN_FAILURE:
      return state.set('loggedIn', false)
        .set('logginIn', false)
        .set('user', {})
    case userConstants.LOGOUT:
      return state.set('loggedIn', false)
        .set('logginIn', false)
        .set('user', {})
    default:
      return state
  }
}