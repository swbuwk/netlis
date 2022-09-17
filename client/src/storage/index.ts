import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import UserSlice from './UserSlice/UserSlice'

const makeStore = () => configureStore({
  reducer: {
    user: UserSlice
  }
})

const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = typeof store.dispatch
export const wrapper = createWrapper<AppStore>(makeStore);
