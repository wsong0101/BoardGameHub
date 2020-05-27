import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducer'

const loggerMiddleware = createLogger()

export const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()]
})