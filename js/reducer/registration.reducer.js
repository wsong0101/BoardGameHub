import { createSlice } from '@reduxjs/toolkit'

const register = createSlice({
  name: 'register',
  initialState: {},
  reducers: {
    registerRequest(state, action) {
      state.registering = true
    },
    registerSuccess(state, action) {
      state = {}
    },
    registerFailure(state, action) {      
      state = {}
    }
  }
})

export const { registerRequest, registerSuccess, registerFailure } = register.actions
export default register.reducer