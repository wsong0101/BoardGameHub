import { userConstants } from '../constant';
import { Util } from '../util'

export function collection(state = {}, action) {
  switch (action.type) {
    case userConstants.GET_COLLECTION_REQUEST:
      state.gettingCollection = true
    case userConstants.GET_COLLECTION_SUCCESS:
      for (let col of action.data.collection) {
        col.Status = Util.getStatusListFromCollection(col)
      }
      state = action.data
    case userConstants.GET_COLLECTION_FAILURE:
      return initialCollectionState
    case userConstants.UPDATE_COLLECTION_REQUEST:
      return state.set('updatingCollection', true)
    case userConstants.UPDATE_COLLECTION_SUCCESS:
      if (!state.get('collection')) {
        return state
      }
      let index = state.get('collection').findIndex(e => e.ID == action.update.id)
      return state
        .set('updatingCollection', false)
        .updateIn(['collection', index],
          e => {
            Util.updateCollection(e, action.update.type, action.update.value)
            return e
          })
    case userConstants.UPDATE_COLLECTION_FAILURE:
      return initialCollectionState
    default:
      return state
  }
}

const initialModalState = { showModal: false }

export function modal(state = initialModalState, action) {
  switch(action.type) {
    case userConstants.SHOW_MODAL:
      return state.set('showModal', true).set('collection', action.collection)
    case userConstants.HIDE_MODAL:
      return state.set('showModal', false)
    case userConstants.UPDATE_MODAL:
      if (!state.get('collection') || !state.get('showModal')) {
        return state
      }
      const id = state.get('collection').ItemID ? state.get('collection').ItemID : state.get('collection').ID 
      if (id != action.update.id) {
        return state
      }
      return state.update('collection', e => {
          Util.updateCollection(e, action.update.type, action.update.value)
          return e
        }
      )
    default:
      return state
  }
}

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