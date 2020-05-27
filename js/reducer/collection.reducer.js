import { createSlice } from '@reduxjs/toolkit'
import { Util } from '../util'

const collection = createSlice({
  name: 'collection',
  initialState: {},
  reducers: {
    collectionRequest(state, action) {
      state.gettingCollection = true
    },
    collectionSuccess: {
      reducer(state, action) {
        const { collection } = action.payload

        for (let col of collection.collection) {
          col.Status = Util.getStatusListFromCollection(col)
        }
      state.gettingCollection = false
      state.collection = collection.collection
      },
      prepare(collection) {
        return { payload: {collection} }
      }
    },
    collectionFailure(state, action) {      
      state = {}
    },
    collectionUpdate: {
      reducer(state, action) {
        const { id, type, value } = action.payload
        let found = state.collection.find(e => e.ID == id)
        if (found) {
          Util.updateCollection(found, type, value)
        }
      },
      prepare(id, type, value) {
        return { payload: { id, type, value } }
      }
    },
  }
})

export const { collectionRequest, collectionSuccess, collectionFailure, collectionUpdate } = collection.actions
export default collection.reducer