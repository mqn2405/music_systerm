import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  song: {},
  listSongPlaying: [],
  listType: {
    type: '',
    id: -1,
    playing: false
  }
}

export const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    setSongPlaying: (state, action) => {
      state.song = action.payload
    },

    setSongState: (state, action) => {
      state.song.playing = action.payload
    },

    setListSongPlaying: (state, action) => {
      state.listSongPlaying = action.payload
    },

    setListType: (state, action) => {
      state.listType = action.payload
    }
  },
})

export const { setSongPlaying, setSongState, setListSongPlaying, setListType } = songSlice.actions

export const songData = (state) => state.song
export default songSlice.reducer
