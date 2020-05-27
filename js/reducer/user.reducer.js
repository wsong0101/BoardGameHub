import { userConstants } from '../constant';
import { Util } from '../util'

export function item(state = {}, action) {
  switch(action.type) {
    case userConstants.GET_ITEM_INFO_REQUEST:
      return state.set('gettingInfo', true)
    case userConstants.GET_ITEM_INFO_SUCCESS:
        action.data.collection.Status = Util.getStatusListFromCollection(action.data.collection)
      return state.set('gettingInfo', false)
        .set('item', action.data.item)
        .set('collection', action.data.collection)
    case userConstants.GET_ITEM_INFO_FAILURE:
      return initialItemInfoStatus
    case userConstants.UPDATE_ITEM_INFO:
      if (!state.get('collection')) {
        return state
      }
      if (state.get('collection').ItemID != action.update.id) {
        return state
      }
      return state.update('collection', e => {
        Util.updateCollection(e, action.update.type, action.update.value)
        return e
      })
    default:
      return state
  }
}