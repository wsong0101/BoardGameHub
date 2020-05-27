import { createSlice } from '@reduxjs/toolkit'
import { Util } from '../util'

const modal = createSlice({
  name: 'modal',
  initialState: {},
  reducers: {
    showModal: {
      reducer(state, action) {
        state.showModal = true
        state.collection = action.payload
      },
      payload(collection) {
        console.log(collection)
        return { payload: { collection } }
      }
    },
    hideModal(state, action) {
      state.showModal = false
    },
    updateModal: {
      reducer(state, action) {
        const { type, value } = action.payload
        Util.updateCollection(state.collection, type, value)
      },
      prepare(type, value) {
        return { payload: { type, value } }
      }
    }
  }
})

export const { showModal, hideModal, updateModal } = modal.actions
export default modal.reducer