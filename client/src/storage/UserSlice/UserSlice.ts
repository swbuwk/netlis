import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../models/User'
import cookieCutter from 'cookie-cutter'

interface UserState {
  info: User | null | undefined,
  signedIn: boolean,
}

const initialState: UserState = {
  info: undefined,
  signedIn: false,

}

export const counterSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    signIn(state, action) {
        state.info = action.payload
        if (action.payload) state.signedIn = true
    },
    setUser(state, action) {
        state.info = action.payload
    },
    signOut(state) {
        state.info = null
        state.signedIn = false
        cookieCutter.set("refresh_token", "")
        localStorage.removeItem("access_token")
    }
  }
})

export const { setUser, signOut, signIn } = counterSlice.actions

export default counterSlice.reducer