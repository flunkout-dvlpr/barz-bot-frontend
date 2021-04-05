
export function setToken (state, payload) {
  state.token = payload
}

export function setRefreshToken (state, payload) {
  state.refreshToken = payload
}

export function setUser (state, payload) {
  state.user = payload
}

export function setCurrentTrack (state, payload) {
  state.currentTrack = payload
}

export function setPlaybackStatus (state, payload) {
  state.playbackStatus = payload
}

export function resetSpotify (state) {
  state.token = null
  state.refreshToken = null
  state.user = null
  state.currentTrack = null
  state.playbackStatus = null
}
