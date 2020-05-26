import { userConstants } from '../constant'
import { Map } from 'immutable'

let user = JSON.parse(sessionStorage.getItem('user'))
const initialState = user ? Map({ loggedIn: true, user: Map(user) }) : Map({ loggedIn: false, user: {} })

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggedIn: false,
        loggingIn: true,
        user: action.user
      }
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      }
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        user: {}
      }
    case userConstants.LOGOUT:
      return {
        loggedIn: false,
        user: {}
      }
    default:
      return state
  }
}