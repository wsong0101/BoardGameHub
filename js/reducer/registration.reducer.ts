import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SliceState = { registering: true } | { registering: false }

const register = createSlice({
  name: 'register',
  initialState: { registering: false } as SliceState,
  reducers: {
    setRegisterState: {
      reducer(state, action: PayloadAction<boolean>) {
        state.registering = action.payload
      },
      prepare(value: boolean) {
        return { payload: value }
      }
    },
  }
})

export const { setRegisterState } = register.actions
export default register.reducer