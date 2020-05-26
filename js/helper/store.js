import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Map } from 'immutable'

import rootReducer from '../reducer';

const loggerMiddleware = createLogger();

const initialState = Map();
export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)