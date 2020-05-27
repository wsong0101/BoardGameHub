import { createSlice } from '@reduxjs/toolkit'

const alert = createSlice({
  name: 'alert',
  initialState: {},
  reducers: {
    alertSuccess: {
      reducer(state, action) {
        const { message } = action.payload
        state.type = 'success'
        state.message = message
      },
      prepare(message) {
        return { payload: { message } }
      }
    },
    alertError: {
      reducer(state, action) {
        const { message } = action.payload
        state.type = 'error'
        state.message = message
      },
      prepare(message) {
        return { payload: { message } }
      }
    },
    alertClear(state, action) {
      state.message = undefined
    }
  }
})

export const { alertSuccess, alertError, alertClear } = alert.actions
export  default alert.reducer