import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Util } from '../util'
import { ICollection, ICollectionUpdate } from '../common'

interface SliceState {
  gettingCollection: boolean
  collection?: ICollection[]
  importing: boolean
}

const collection = createSlice({
  name: 'collection',
  initialState: { gettingCollection: false, importing: false } as SliceState,
  reducers: {
    collectionRequest(state) {
      state.gettingCollection = true
    },
    collectionSuccess: {
      reducer(state, action: PayloadAction<any>) {
        const collection = action.payload.collection
        state.gettingCollection = false
        state.collection = collection
        
        if (!collection) {
          return
        }
        for (let col of collection) {
          col.Status = Util.getStatusListFromCollection(col)
        }
      },
      prepare(data: any) {
        return { payload: data }
      }
    },
    collectionFailure(state) {      
      state.gettingCollection = false
    },
    collectionUpdate: {
      reducer(state, action: PayloadAction<ICollectionUpdate>) {
        if (!state.collection) {
          return state
        }
        let found = state.collection.find(e => e.ID == action.payload.ID)
        if (found) {
          Util.updateCollection(found, action.payload)
        }
      },
      prepare(update: ICollectionUpdate) {
        return { payload: update }
      }
    },
    collectionImportRequest(state) {
      state.importing = true
    },
    collectionImportSuccess: {
      reducer(state, action: PayloadAction<ICollection[]>) {
        state.importing = false
        state.collection = action.payload
      },
      prepare(collection: ICollection[]) {
        collection.sort((a: ICollection, b: ICollection) => {
          if (a.IsExistInDB == b.IsExistInDB) {
            return 0
          }
          if (a.IsExistInDB) {
            return 1
          }
          return -1
        })
        return { payload: collection }
      }
    },
    collectionImportFailure(state) {
      state.importing = false
      delete state.collection
    }
  }
})

export const {
  collectionRequest, collectionSuccess, collectionFailure, collectionUpdate,
  collectionImportRequest, collectionImportSuccess, collectionImportFailure,
} = collection.actions
export default collection.reducer