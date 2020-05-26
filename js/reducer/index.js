import { combineReducers } from 'redux-immutable';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { collection, modal } from './user.reducer'

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  collection,
  modal,
})

export default rootReducer