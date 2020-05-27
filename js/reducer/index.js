import { combineReducers } from 'redux'

import authReducer from './authentication.reducer'
import { registration } from './registration.reducer'
import alertReducer from './alert.reducer'
import collectionReducer from './collection.reducer'
import modalReducer from './modal.reducer'
import { modal, item } from './user.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  registration,
  collection: collectionReducer,
  modal: modalReducer,
  item,
})

export default rootReducer

export * from './authentication.reducer'
export * from './alert.reducer'
export * from './collection.reducer'
export * from './modal.reducer'