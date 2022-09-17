import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Track } from '../../models/Track'
import { RootState } from '..'
import { boolean } from 'yup'
import { shuffle } from '../../utils/shuffle'

export enum RepeatingVariants {
  NONE="none",
  FULL="full",
  ONE="one"
}

interface PlaylistState {
  default: Track[]
  tracks: Track[],
  currentTrack: Track | null,
  volume: number,
  isPlaying: boolean,
  isShuffled,
  time: number,
  duration: number,
  locked: boolean
  repeating: RepeatingVariants
}

const initialState: PlaylistState = {
  default: [],
  tracks: [],
  currentTrack: null,
  volume: 0.5,
  isPlaying: false,
  isShuffled: false,
  time: 0,
  duration: 0,
  locked: false,
  repeating: RepeatingVariants.NONE
}

export const counterSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylist(state, action: PayloadAction<PlaylistState>) {
      state.isPlaying = false
      state.currentTrack = action.payload.currentTrack || initialState.currentTrack
      state.default = action.payload.default || initialState.default
      state.isShuffled = action.payload.isShuffled || initialState.isPlaying
      state.repeating = action.payload.repeating || initialState.repeating
      state.tracks = action.payload.tracks || initialState.tracks
      state.volume = action.payload.volume || initialState.volume
      state.time = action.payload.time || initialState.time
    },
    clearPlaylist(state) {
      state.isPlaying = false
      state.currentTrack =  initialState.currentTrack
      localStorage.removeItem("current_track")
      state.default = initialState.default
      state.isShuffled = initialState.isPlaying
      state.repeating =  initialState.repeating
      localStorage.removeItem("options")
      state.tracks =  initialState.tracks
      localStorage.removeItem("tracks")
      state.volume = initialState.volume
      localStorage.removeItem("volume")
      state.time = initialState.time
      localStorage.removeItem("audio_time")
    },
    addTracks(state, action) {
      if (!action.payload) return
      const tracks = action.payload
      state.default = [...state.tracks, ...tracks]
      state.tracks = state.default
      localStorage.setItem("tracks", JSON.stringify(state.default))
    },
    setTracks(state, action) {
      state.default = action.payload
      state.tracks = state.default
      localStorage.setItem("tracks", JSON.stringify(state.default))

    },
    removeTrack(state, action: PayloadAction<Track>) {
        if (state.currentTrack && action.payload.id === state.currentTrack.id) {
          state.currentTrack = initialState.currentTrack
          state.isPlaying = false
        }
        const index = state.tracks.findIndex(track => track.id === action.payload.id)
        state.default = state.tracks.filter((_, i) => i !== index)
        state.tracks = state.default
        localStorage.setItem("tracks", JSON.stringify(state.default))

    },
    setCurrentTrack(state, action) {
        state.currentTrack = action.payload
        localStorage.setItem("current_track", JSON.stringify(state.currentTrack))
    },
    lock(state) {
      state.locked = true
    },
    unlock(state) {
      state.locked = false
    }, 
    play(state) {
      if (!state.locked) state.isPlaying = true
    },
    pause(state) {
      if (!state.locked) state.isPlaying = false
    },
    togglePlay(state) {
      if (!state.locked) state.isPlaying = !state.isPlaying
    },
    prevTrack(state) {
      const index = state.tracks.findIndex((track) => track.id === state.currentTrack.id)
      state.currentTrack = state.tracks[index === 0 ? 0 : index-1]
      localStorage.setItem("current_track", JSON.stringify(state.currentTrack))
    },
    nextTrack(state) {
      const index = state.tracks.findIndex((track) => track.id === state.currentTrack.id)
      state.currentTrack = state.tracks[index === state.tracks.length - 1 ? 0 : index+1]
      localStorage.setItem("current_track", JSON.stringify(state.currentTrack))
    },
    autoNextTrack(state) {
      const index = state.tracks.findIndex((track) => track.id === state.currentTrack.id)
      if (state.repeating === RepeatingVariants.NONE) {
        state.currentTrack = state.tracks[index === state.tracks.length - 1 ? state.tracks.length - 1 : index+1]
      }
      if (state.repeating === RepeatingVariants.FULL) {
        state.currentTrack = state.tracks[index === state.tracks.length - 1 ? 0 : index+1]
      }
      if (state.repeating === RepeatingVariants.ONE) {
        state.currentTrack = state.tracks[index]
      }
      localStorage.setItem("current_track", JSON.stringify(state.currentTrack))
    },
    toggleRepeating(state) {
      if (state.repeating === RepeatingVariants.NONE) state.repeating = RepeatingVariants.FULL
      else if (state.repeating === RepeatingVariants.FULL) state.repeating = RepeatingVariants.ONE
      else state.repeating = RepeatingVariants.NONE
      localStorage.setItem("options", JSON.stringify({repeating: state.repeating, shuffle: state.isShuffled}))
    },
    toggleShuffle(state) {
      state.isShuffled = !state.isShuffled
      if (state.isShuffled) {
        state.tracks = shuffle(state.default)
      } else {
        state.tracks = state.default
      }
      localStorage.setItem("options", JSON.stringify({repeating: state.repeating, shuffle: state.isShuffled}))
    },
    setVolume(state, action) {
      state.volume = action.payload
      localStorage.setItem("volume", JSON.stringify(state.volume))
    },
    setTime(state, action) {
      state.time = action.payload
      localStorage.setItem("audio_time", JSON.stringify(state.time))
    },
    setDuration(state, action) {
      state.duration = action.payload
    }
  },
  
})

export const {
              addTracks,
              removeTrack,
              setCurrentTrack,
              play,
              pause,
              prevTrack,
              nextTrack,
              toggleRepeating,
              autoNextTrack,
              toggleShuffle,
              setVolume, 
              setPlaylist,
              clearPlaylist,
              togglePlay,
              setTracks,
              lock,
              unlock,
              setTime,
              setDuration
             } = counterSlice.actions

export default counterSlice.reducer