import { userConstants } from '../constant'
import { Map } from 'immutable'

const initialState = Map({})

export function registration(state = initialState, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return state.set('registering', true)
    case userConstants.REGISTER_SUCCESS:
      return initialState
    case userConstants.REGISTER_FAILURE:
      return initialState
    default:
      return state
  }
}