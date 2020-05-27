import { createSlice } from '@reduxjs/toolkit'

let user = JSON.parse(sessionStorage.getItem('user'))

const auth = createSlice({
  name: 'auth',
  initialState: user ? { loggedIn: true, user: user } : { loggedIn: false, user: {} },
  reducers: {
    authRequest: {
      reducer(state, action) {
        const { user } = action.payload
        state.loggingIn = true
        state.loggedIn = false
        state.user = user
      },
      prepare(user) {
        return { payload: { user } }
      }
    },
    authSuccess: {
      reducer(state, action) {
        const { user } = action.payload
        state.loggingIn = false
        state.loggedIn = true
        state.user = user
      },
      prepare(user) {
        return { payload: {user} }
      }
    },
    authFailure(state, action) {      
      state.loggingIn = false
      state.loggedIn = false
      state.user = {}
    },
    authLogout(state, action) {
      state.loggingIn = false
      state.loggedIn = false
      state.user = {}
    },
  }
})

export const { authRequest, authSuccess, authFailure, authLogout } = auth.actions
export default auth.reducer