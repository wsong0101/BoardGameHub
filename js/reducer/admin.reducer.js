import { createSlice } from '@reduxjs/toolkit'

const admin = createSlice({
  name: 'admin',
  initialState: {},
  reducers: {
    adminGetProposes: {
      reducer(state, action) {
        state.proposes = action.payload.data
      },
      prepare(data) {
        return { payload: { data } }
      }
    },
  }
})

export const { adminGetProposes } = admin.actions
export default admin.reducer