import { createSlice } from '@reduxjs/toolkit'
import { Util } from '../util'

const item = createSlice({
  name: 'item',
  initialState: {},
  reducers: {
    itemRequest(state, action) {
      state.gettingItem = true
    },
    itemSuccess: {
      reducer(state, action) {
        const { data } = action.payload
        data.collection.Status = Util.getStatusListFromCollection(data.collection)
        state.gettingItem = false
        state.item = data.item
        state.collection = data.collection
      },
      prepare(data) {
        return { payload: { data } }
      }
    },
    itemFailure(state, action) {      
      state = {}
    },
    itemUpdate: {
      reducer(state, action) {
        if (!state.collection) {
          return
        }
        const { type, value } = action.payload
        Util.updateCollection(state.collection, type, value)
      },
      prepare(type, value) {
        return { payload: { type, value } }
      }
    },
    itemImportRequest: {
      reducer(state, action) {
        state.importing = true
      }
    },
    itemImportSuccess: {
      reducer(state, action) {
        state.importing = false
      }
    },
    itemImportFailure: {
      reducer(state, action) {
        state.importing = false
      }
    }
  }
})

export const {
  itemRequest, itemSuccess, itemFailure, itemUpdate,
  itemImportRequest, itemImportSuccess, itemImportFailure,
} = item.actions
export default item.reducer