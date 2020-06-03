import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SliceState {
  Type: string
  Message: string
}

const alert = createSlice({
  name: 'alert',
  initialState: { Type: "", Message: "" } as SliceState,
  reducers: {
    alertSuccess: {
      reducer(state, action: PayloadAction<string>) {
        state.Type = 'success'
        state.Message = action.payload
      },
      prepare(message: string) {
        return { payload: message }
      }
    },
    alertError: {
      reducer(state, action: PayloadAction<string>) {
        state.Type = 'error'
        state.Message = action.payload
      },
      prepare(message: string) {
        return { payload: message }
      }
    },
    alertClear(state) {
      state.Message = ""
    }
  }
})

export const { alertSuccess, alertError, alertClear } = alert.actions
export  default alert.reducer