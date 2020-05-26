import { userConstants } from '../constant';

export function userCollection(state = {}, action) {
  switch (action.type) {
    case userConstants.GETCOLLECTION_REQUEST:
      return { gettingCollection: true }
    case userConstants.GETCOLLECTION_SUCCESS:
      return {}
    case userConstants.GETCOLLECTION_FAILURE:
      return {}
    default:
      return state
  }
}