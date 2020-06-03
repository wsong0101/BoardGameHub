import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPropose } from '../common'

interface SliceState {
  proposes: IPropose[]
}

const admin = createSlice({
  name: 'admin',
  initialState: { proposes: [] },
  reducers: {
    adminGetProposes: {
      reducer(state, action: PayloadAction<IPropose[]>) {
        state.proposes = action.payload
      },
      prepare(data: IPropose[]) {
        return { payload: data }
      }
    },
  }
})

export const { adminGetProposes } = admin.actions
export default admin.reducer