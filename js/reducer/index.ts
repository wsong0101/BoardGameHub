import { combineReducers } from 'redux'

import authReducer from './authentication.reducer'
import registerReducer from './registration.reducer'
import alertReducer from './alert.reducer'
import collectionReducer from './collection.reducer'
import modalReducer from './modal.reducer'
import itemReducer from './item.reducer'
import adminReducer from './admin.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  register: registerReducer,
  collection: collectionReducer,
  modal: modalReducer,
  item: itemReducer,
  admin: adminReducer,
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>

export * from './authentication.reducer'
export * from './registration.reducer'
export * from './alert.reducer'
export * from './collection.reducer'
export * from './modal.reducer'
export * from './item.reducer'
export * from './admin.reducer'