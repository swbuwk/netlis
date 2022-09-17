import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../models/User'
import cookieCutter from 'cookie-cutter'
import { updateUser } from '../Actions/updateUser'
import { boolean } from 'yup'
import { Album } from '../../models/Album'

interface UserState {
  info: User | null | undefined,
  signedIn: boolean,
  loading: boolean
}

const initialState: UserState = {
  info: undefined,
  signedIn: false,
  loading: true
}

export const counterSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setUser(state, action) {
        state.info = action.payload
    },
    signOut(state) {
        state.info = null
        state.signedIn = false
        cookieCutter.set("refresh_token", "")
        localStorage.removeItem("access_token")
    }
  },
  extraReducers(builder) {
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.info = action.payload
      state.signedIn = true
      state.loading = false
    })
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateUser.rejected, (state) => {
      state.info = initialState.info
      state.signedIn = initialState.signedIn
      state.loading = false
    })
  },
})

export const { setUser, signOut } = counterSlice.actions

export default counterSlice.reducer