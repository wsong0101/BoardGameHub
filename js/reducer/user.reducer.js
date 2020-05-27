import { Map, fromJS } from 'immutable'

import { userConstants } from '../constant';
import { Util } from '../util'

const initialCollectionState = Map({})

export function collection(state = initialCollectionState, action) {
  switch (action.type) {
    case userConstants.GET_COLLECTION_REQUEST:
      return state.set('gettingCollection', true)
    case userConstants.GET_COLLECTION_SUCCESS:
      for (let col of action.data.collection) {
        col.Status = Util.getStatusListFromCollection(col)
      }
      return Map(action.data)
    case userConstants.GET_COLLECTION_FAILURE:
      return initialCollectionState
    case userConstants.UPDATE_COLLECTION_REQUEST:
      return state.set('updatingCollection', true)
    case userConstants.UPDATE_COLLECTION_SUCCESS:
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

const initialModalState = Map({ showModal: false })

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
      if (state.get('collection').ID != action.update.id) {
        return state
      }
      state.update('collection', e => {
        Util.updateCollection(e, action.update.type, action.update.value)
        return
      })
      return state
    default:
      return state
  }
}

const initialItemInfoStatus = Map({})

export function item(state = initialItemInfoStatus, action) {
  switch(action.type) {
    case userConstants.GET_ITEM_INFO_REQUEST:
      return state.set('gettingInfo', true)
    case userConstants.GET_ITEM_INFO_SUCCESS:
      return state.set('gettingInfo', false)
        .set('info', action.data)
    case userConstants.GET_ITEM_INFO_FAILURE:
      return initialItemInfoStatus
    default:
      return state
  }
}