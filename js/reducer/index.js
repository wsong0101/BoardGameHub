import { combineReducers } from 'redux'

import authReducer from './authentication.reducer';
import { registration } from './registration.reducer';
import alertReducer from './alert.reducer';
import { collection, modal, item } from './user.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  registration,
  collection,
  modal,
  item,
})

export default rootReducer

export * from './authentication.reducer'
export * from './alert.reducer'