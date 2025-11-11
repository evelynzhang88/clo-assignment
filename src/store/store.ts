import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import contentReducer from './slices/contentSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    content: contentReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

