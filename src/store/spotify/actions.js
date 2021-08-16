
export function loadAuthorizationCode ({ commit, state }) {
  commit('resetSpotify')
  var urlParameters = new URLSearchParams(window.location.search)
  if (urlParameters.get('code')) {
    console.log('loadAuthorizationCode(): Code URL query parameter found')
    var authorizationCode = urlParameters.get('code')
    return authorizationCode
  } else {
    console.log('loadAuthorizationCode(): Code URL query parameter NOT found')
    return null
  }
}

export function refreshToken ({ dispatch, commit, state }) {
  if (!state.refreshToken) return null
  var body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: state.refreshToken
  })
  var headers = {
    headers: {
      Authorization: 'Basic ' + btoa(state.client_id + ':' + state.client_secret)
    }
  }
  return this._vm.$axios.post('https://accounts.spotify.com/api/token', body.toString(), headers)
    .then((response) => {
      if (response.status === 200) {
        console.log('refreshToken(): Successfully refreshed token')
        var token = response.data.access_token
        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        commit('setToken', token)
        dispatch('spotify/loadUser', null, { root: true })
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
    }).catch((error) => {
      console.log('refreshToken(): Failed to refresh token ->', error)
      commit('resetSpotify')
      return null
    })
}

export function loadAccessCode ({ dispatch, commit, state }, authorizationCode) {
  var body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: state.redirect_uri
  })
  var headers = {
    headers: {
      Authorization: 'Basic ' + btoa(state.client_id + ':' + state.client_secret)
    }
  }
  return this._vm.$axios.post('https://accounts.spotify.com/api/token', body.toString(), headers)
    .then((response) => {
      if (response.status === 200) {
        console.log('loadAccessCode(): Successfully retrieved USER token')
        var token = response.data.access_token
        var refreshToken = response.data.refresh_token
        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        commit('setToken', token)
        commit('setRefreshToken', refreshToken)
        dispatch('spotify/loadUser', null, { root: true })
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
    }).catch((error) => {
      console.log('loadAccessCode(): Failed to retrieve USER token ->', error)
      commit('resetSpotify')
      return null
    })
}

export function loadAccessCodeFromClientCredentials ({ dispatch, commit, state }) {
  var body = new URLSearchParams({
    grant_type: 'client_credentials'
  })
  var headers = {
    headers: {
      Authorization: 'Basic ' + btoa(state.client_id + ':' + state.client_secret)
    }
  }
  return this._vm.$axios.post('https://accounts.spotify.com/api/token', body.toString(), headers)
    .then((response) => {
      if (response.status === 200) {
        console.log('loadAccessCodeFromClientCredentials(): Successfully retrieved BARZBOT token')
        var token = response.data.access_token
        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        commit('setToken', token)
      }
    }).catch((error) => {
      console.log('loadAccessCodeFromClientCredentials(): Failed to retrieve BARZBOT token ->', error)
      commit('resetSpotify')
      return null
    })
}

export function loadUser ({ commit }) {
  return this._vm.$axios.get('https://api.spotify.com/v1/me')
    .then((response) => {
      if (response.status === 200) {
        console.log('loadUser(): Successfully retrieved Spotify user object')
        var user = response.data
        commit('setUser', user)
      }
    }).catch((error) => {
      console.log('loadUser(): Failed to retrieve Spotify user ->', error)
      commit('resetSpotify')
      return null
    })
}

export function loadSpotifyToken ({ state }) {
  console.log('loadSpotifyToken(): Successfully set Authorization Header with Spotify token')
  this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${state.token}`
  return true
}

export function loadCurrentTrack ({ commit, dispatch }) {
  // commit('genius/setLyrics', null, { root: true })
  return this._vm.$axios.get('https://api.spotify.com/v1/me/player/currently-playing')
    .then((response) => {
      if (response.status === 200) {
        var currentTrack = response.data
        console.log('loadCurrentTrack(): Successfully retrieved Spotify track ->', currentTrack)
        commit('setCurrentTrack', currentTrack)
        dispatch('genius/searchSong', null, { root: true })
      }
    }).catch((error) => {
      console.log('loadCurrentTrack(): Failed to retrieve Spotify track ->', error)
      return null
    })
}

export function loadTrackFromId ({ commit, dispatch }, trackId) {
  commit('genius/setLyrics', null, { root: true })
  return this._vm.$axios.get(`https://api.spotify.com/v1/tracks/${trackId}`)
    .then((response) => {
      if (response.status === 200) {
        var currentTrack = response.data
        console.log('loadTrackFromId(): Successfully retrieved Spotify track from ID ->', currentTrack)
        commit('setCurrentTrack', { item: currentTrack })
        dispatch('genius/searchSong', null, { root: true })
      }
    }).catch((error) => {
      console.log('loadTrackFromId(): Failed to retrieve Spotify track from ID ->', error)
      return null
    })
}

export function loadTracksFromSearch ({ commit, dispatch }, songName) {
  commit('genius/setLyrics', null, { root: true })
  return this._vm.$axios.get(`https://api.spotify.com/v1/search?q=${songName}&type=track`)
    .then((response) => {
      if (response.status === 200) {
        console.log('loadTracksFromSearch(): Successfully retrieved Spotify tracks from search')
        return response.data.tracks.items
      }
    }).catch((error) => {
      console.log('loadTracksFromSearch(): Failed to retrieve Spotify tracks from search ->', error)
      return null
    })
}

export function previous ({ dispatch }) {
  return this._vm.$axios.post('https://api.spotify.com/v1/me/player/previous')
    .then((response) => {
      if (response.status === 204) {
        console.log('previous(): Successfully requested previous track')
        setTimeout(() => {
          dispatch('spotify/loadCurrentTrack', null, { root: true })
        }, 300)
      }
    })
    .catch((error) => {
      console.log('previous(): Failed to request previous track ->', error)
      let message = 'Spotify Sync Required!'
      if (error.response.data.error.reason === 'NO_ACTIVE_DEVICE') {
        message = 'Play a song on Spotify!'
      }
      this._vm.$q.notify({
        color: 'warning',
        position: 'top',
        textColor: 'grey-9',
        message: message,
        icon: 'report_problem'
      })
      return null
    })
}

export function next ({ dispatch }) {
  return this._vm.$axios.post('https://api.spotify.com/v1/me/player/next')
    .then((response) => {
      if (response.status === 204) {
        console.log('next(): Successfully requested next track')
        setTimeout(() => {
          dispatch('spotify/loadCurrentTrack', null, { root: true })
        }, 300)
      }
    })
    .catch((error) => {
      console.log('next(): Failed to request next track ->', error)
      let message = 'Spotify Sync Required!'
      if (error.response.data.error.reason === 'NO_ACTIVE_DEVICE') {
        message = 'Play a song on Spotify!'
      }
      this._vm.$q.notify({
        color: 'warning',
        position: 'top',
        textColor: 'grey-9',
        message: message,
        icon: 'report_problem'
      })
      return null
    })
}

export function play ({ dispatch }, trackId) {
  dispatch('spotify/loadSpotifyToken', null, { root: true })
  var body = {}
  if (trackId) {
    body = {
      uris: [`spotify:track:${trackId}`]
    }
  }
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/play', body)
    .then((response) => {
      console.log('play(): Successfully played track ->', response)
      if (response.status === 204 && !trackId) {
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
    })
    .catch((error) => {
      console.log('play(): Failed to play track ->', error)
      this._vm.$q.notify({
        color: 'warning',
        position: 'top',
        textColor: 'grey-9',
        message: 'Spotify Sync Required!',
        icon: 'report_problem'
      })
      return null
    })
}

export function pause ({ dispatch }) {
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/pause')
    .then((response) => {
      console.log('pause(): Successfully paused track ->', response)
      if (response.status === 204) {
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
    })
    .catch((error) => {
      console.log('pause(): Failed to pause track ->', error)
      this._vm.$q.notify({
        color: 'warning',
        position: 'top',
        textColor: 'grey-9',
        message: 'Spotify Sync Required!',
        icon: 'report_problem'
      })
      return null
    })
}

export function setVolume ({ state }, payload) {
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/volume?volume_percent=' + payload)
    .then((response) => {
      if (response.status === 204) {
        console.log('setVolume(): Successfully adjusted volume')
        return response.status
      }
    })
    .catch((error) => {
      console.log('setVolume(): Failed to adjust volume ->', error)
      var device = state.playbackStatus.device.name
      this._vm.$q.notify({
        color: 'negative',
        position: 'top',
        textColor: 'grey-9',
        message: `Can't control ${device}, Sorry :(`,
        icon: 'report_problem'
      })
      return null
    })
}

export function setPlayback (state, payload) {
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/seek?position_ms=' + payload)
    .then((response) => {
      if (response.status === 204) {
        console.log('setPlayback(): Successfully adjusted playback')
      }
    })
    .catch((error) => {
      console.log('setPlayback(): Failed to adjust playback ->', error)
      return null
    })
}

export function playback ({ commit }) {
  return this._vm.$axios.get('https://api.spotify.com/v1/me/player')
    .then((response) => {
      if (response.status === 200) {
        var playbackStatus = response.data
        console.log('playback(): Successfully retrieved/updated playback')
        commit('setPlaybackStatus', playbackStatus)
        return playbackStatus
      } else if (response.status === 204) {
        console.log('playback(): No active track to retrieve/update playback')
        this._vm.$q.notify({
          color: 'warning',
          position: 'top',
          textColor: 'grey-9',
          message: 'Play a song on Spotify!',
          icon: 'report_problem'
        })
        return null
      }
    })
    .catch((error) => {
      console.log('playback(): Failed to retrieve/update playback ->', error)
      this._vm.$q.notify({
        color: 'warning',
        position: 'top',
        textColor: 'grey-9',
        message: 'Spotify Sync Required!',
        icon: 'report_problem'
      })
      return null
    })
}
