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
        if (collection.collection) {
          for (let col of collection.collection) {
            col.Status = Util.getStatusListFromCollection(col)
          }
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
        if (!state.collection) {
          return state
        }
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
    collectionImportRequest: {
      reducer(state, action) {
        state.importing = true
      }
    },
    collectionImportSuccess: {
      reducer(state, action) {
        state.importing = false
        state.collection = action.payload
      },
      prepare(data) {
        data.sort((a, b) => {
          if (a.IsExistInDB == b.IsExistInDB) {
            return 0
          }
          if (a.IsExistInDB) {
            return 1
          }
          return -1
        })
        return { payload: data }
      }
    },
    collectionImportFailure: {
      reducer(state, action) {
        state.importing = false
        state.collection = {}
      }
    }
  }
})

export const {
  collectionRequest, collectionSuccess, collectionFailure, collectionUpdate,
  collectionImportRequest, collectionImportSuccess, collectionImportFailure,
} = collection.actions
export default collection.reducer