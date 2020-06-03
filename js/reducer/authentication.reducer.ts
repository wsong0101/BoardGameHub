import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../common'

interface SliceState {
  loggingIn: boolean
  loggedIn: boolean
  user?: IUser
}

let user = JSON.parse(sessionStorage.getItem('user'))

let initialState: SliceState
initialState.loggingIn = false
if (user) {
  initialState.loggedIn = true
  initialState.user = user as IUser
} else {
  initialState.loggedIn = false
}

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRequest(state) {
      state.loggingIn = true
      state.loggedIn = false
    },
    authSuccess: {
      reducer(state, action: PayloadAction<IUser>) {
        state.loggingIn = false
        state.loggedIn = true
        state.user = action.payload
      },
      prepare(user: IUser) {
        return { payload: user }
      }
    },
    authFailure(state) {      
      state.loggingIn = false
      state.loggedIn = false
      delete state.user
    },
    authLogout(state) {
      state.loggingIn = false
      state.loggedIn = false
      delete state.user
    },
  }
})

export const { authRequest, authSuccess, authFailure, authLogout } = auth.actions
export default auth.reducer