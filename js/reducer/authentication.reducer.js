import { userConstants } from '../constant'

let user = JSON.parse(sessionStorage.getItem('user'))
const initialState = user ? { loggedIn: true, user } : { loggedIn: false, user: {} }

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggedIn: false,
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