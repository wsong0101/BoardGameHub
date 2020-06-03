import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Util } from '../util'
import { ICollection, ICollectionUpdate } from '../common'

interface SliceState {
  showModal: boolean
  collection: ICollection
}

const modal = createSlice({
  name: 'modal',
  initialState: { showModal: false, collection: {} } as SliceState,
  reducers: {
    showModal: {
      reducer(state, action: PayloadAction<ICollection>) {
        state.showModal = true
        state.collection = action.payload
      },
      prepare(collection: ICollection) {
        return { payload: collection }
      }
    },
    hideModal(state) {
      state.showModal = false
    },
    updateModal: {
      reducer(state, action: PayloadAction<ICollectionUpdate>) {
        Util.updateCollection(state.collection, action.payload)
      },
      prepare(update: ICollectionUpdate) {
        return { payload: update }
      }
    }
  }
})

export const { showModal, hideModal, updateModal } = modal.actions
export default modal.reducer