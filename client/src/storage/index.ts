import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { createWrapper } from 'next-redux-wrapper'
import { albumsApi } from './ApiSlice/AlbumsApi'
import { tracksApi } from './ApiSlice/TracksApi'
import { userApi } from './ApiSlice/UserApi'
import PlaylistSlice from './PlaylistSlice/PlaylistSlice'
import UserSlice from './UserSlice/UserSlice'

const makeStore = () => configureStore({
  reducer: {
    playlist: PlaylistSlice,
    user: UserSlice,
    [albumsApi.reducerPath]: albumsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [tracksApi.reducerPath]: tracksApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(albumsApi.middleware, userApi.middleware, tracksApi.middleware),
})

const store = makeStore()

setupListeners(store.dispatch)

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = typeof store.dispatch
export const wrapper = createWrapper<AppStore>(makeStore);
