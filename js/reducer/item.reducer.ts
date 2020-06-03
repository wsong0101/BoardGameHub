import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Util } from '../util'
import { ITag, IPropose, ICollection, IItem, ICollectionUpdate } from '../common'

interface SliceState {
  gettingItem: boolean
  item?: IItem
  collection?: ICollection
  propose?: IPropose
  importing: boolean
  tag?: ITag
}

const item = createSlice({
  name: 'item',
  initialState: { gettingItem: false, importing: false } as SliceState,
  reducers: {
    itemRequest(state) {
      state.gettingItem = true
    },
    itemSuccess: {
      reducer(state, action: PayloadAction<any>) {
        const { data } = action.payload
        data.collection.Status = Util.getStatusListFromCollection(data.collection)
        state.gettingItem = false
        state.item = data.item
        state.collection = data.collection
      },
      prepare(data: PayloadAction<any>) {
        return { payload: { data } }
      }
    },
    itemFailure(state) {      
      state.gettingItem = false
    },
    itemUpdate: {
      reducer(state, action: PayloadAction<ICollectionUpdate>) {
        Util.updateCollection(state.collection, action.payload)
      },
      prepare(update: ICollectionUpdate) {
        return { payload: update }
      }
    },
    setImportState: {
      reducer(state, action: PayloadAction<boolean>) {
        state.importing = action.payload
      },
      prepare(value: boolean) {
        return { payload: value }
      }
    },
    itemProposeKorean: {
      reducer(state, action: PayloadAction<any>) {
        state.propose = {
          Type: action.payload.type,
          Value: action.payload.name,
          ID: action.payload.id,
          ReturnPath: action.payload.path,
        }
      },
      prepare(type: string, id: number, name: string, path: string) {
        return { payload: { type, id, name, path } }
      }
    },
    tagSuccess: {
      reducer(state, action: PayloadAction<ITag>) {
        state.tag = action.payload
      },
      prepare(data: ITag) {
        return { payload: data }
      }
    }
  }
})

export const {
  itemRequest, itemSuccess, itemFailure, itemUpdate,
  setImportState, itemProposeKorean, tagSuccess,
} = item.actions
export default item.reducer