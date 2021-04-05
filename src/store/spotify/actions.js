
export function loadAuthorizationCode ({ commit, state }) {
  commit('resetSpotify')
  var urlParameters = new URLSearchParams(window.location.search)
  if (urlParameters.get('code')) {
    var authorizationCode = urlParameters.get('code')
    console.log('Loading authorization code')
    return authorizationCode
  } else {
    // An access token is already set
    console.log('not logging in tho')
    return null
  }
}

export function refreshToken ({ dispatch, commit, state }) {
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
        var token = response.data.access_token
        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        commit('setToken', token)
        dispatch('spotify/loadUser', null, { root: true })
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
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
        var token = response.data.access_token
        var refreshToken = response.data.refresh_token
        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        commit('setToken', token)
        commit('setRefreshToken', refreshToken)
        dispatch('spotify/loadUser', null, { root: true })
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
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
      console.log(response)
      if (response.status === 200) {
        var token = response.data.access_token
        console.log('Loading (Client Credentials) token')
        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        commit('setToken', token)
      }
    })
}

export function loadUser ({ commit }) {
  return this._vm.$axios.get('https://api.spotify.com/v1/me')
    .then((response) => {
      if (response.status === 200) {
        var user = response.data
        console.log('Loading user', response)
        commit('setUser', user)
      }
    })
}

export function loadSpotifyToken ({ state }) {
  this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${state.token}`
  return true
}

export function loadCurrentTrack ({ commit, dispatch }) {
  commit('genius/setLyrics', null, { root: true })
  return this._vm.$axios.get('https://api.spotify.com/v1/me/player/currently-playing')
    .then((response) => {
      if (response.status === 200) {
        var currentTrack = response.data
        console.log('Loading current track', currentTrack)
        commit('setCurrentTrack', currentTrack)
        dispatch('genius/searchSong', null, { root: true })
      }
    })
}

export function loadTrackFromId ({ commit, dispatch }, trackId) {
  commit('genius/setLyrics', null, { root: true })
  return this._vm.$axios.get(`https://api.spotify.com/v1/tracks/${trackId}`)
    .then((response) => {
      console.log(response)
      if (response.status === 200) {
        var currentTrack = response.data
        console.log('Loading current track', { item: currentTrack })
        commit('setCurrentTrack', { item: currentTrack })
        dispatch('genius/searchSong', null, { root: true })
      }
    })
}

export function loadTracksFromSearch ({ commit, dispatch }, songName) {
  commit('genius/setLyrics', null, { root: true })
  return this._vm.$axios.get(`https://api.spotify.com/v1/search?q=${songName}&type=track`)
    .then((response) => {
      if (response.status === 200) {
        return response.data.tracks.items
      }
    })
}

export function previous ({ dispatch }) {
  return this._vm.$axios.post('https://api.spotify.com/v1/me/player/previous')
    .then((response) => {
      console.log(response)
      if (response.status === 204) {
        console.log('Previous song')
        setTimeout(() => {
          console.log('Wait to load previous song')
          dispatch('spotify/loadCurrentTrack', null, { root: true })
        }, 300)
      }
    })
    .catch((error) => {
      console.log(error)
      this._vm.$q.notify({
        color: 'warning',
        position: 'top',
        textColor: 'grey-9',
        message: 'Nothing is currently playing!',
        icon: 'report_problem'
      })
      return false
    })
}

export function next ({ dispatch }) {
  return this._vm.$axios.post('https://api.spotify.com/v1/me/player/next')
    .then((response) => {
      if (response.status === 204) {
        console.log('Next song')
        setTimeout(() => {
          console.log('Wait to load next song')
          dispatch('spotify/loadCurrentTrack', null, { root: true })
        }, 300)
      }
    })
    .catch((error) => {
      console.log(error)
      this._vm.$q.notify({
        color: 'warning',
        position: 'top',
        textColor: 'grey-9',
        message: 'Nothing is currently playing!',
        icon: 'report_problem'
      })
      return false
    })
}

export function play ({ dispatch }, trackId) {
  var body = {}
  if (trackId) {
    body = {
      uris: [`spotify:track:${trackId}`]
    }
  }
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/play', body)
    .then((response) => {
      console.log('Playing', response)
      if (response.status === 204 && !trackId) {
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
    })
}

export function pause ({ dispatch }) {
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/pause')
    .then((response) => {
      console.log('Pausing', response)
      if (response.status === 204) {
        dispatch('spotify/loadCurrentTrack', null, { root: true })
      }
    })
}

export function setVolume ({ state }, payload) {
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/volume?volume_percent=' + payload)
    .then((response) => {
      if (response.status === 204) {
        return response.status
      }
    })
    .catch((error) => {
      var device = state.playbackStatus.device.name
      this._vm.$q.notify({
        color: 'negative',
        position: 'top',
        textColor: 'grey-9',
        message: `Can't control ${device}, Sorry :(`,
        icon: 'report_problem'
      })
      return error
    })
}

export function setPlayback (state, payload) {
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/seek?position_ms=' + payload)
    .then((response) => {
      if (response.status === 204) {
        console.log('Playback set to', payload)
      }
    })
}

export function playback ({ commit }) {
  return this._vm.$axios.get('https://api.spotify.com/v1/me/player')
    .then((response) => {
      if (response.status === 200) {
        var playbackStatus = response.data
        console.log('Playback Status', playbackStatus)
        commit('setPlaybackStatus', playbackStatus)
        return playbackStatus
      } else if (response.status === 204) {
        this._vm.$q.notify({
          color: 'warning',
          position: 'top',
          textColor: 'grey-9',
          message: 'Nothing is currently playing!',
          icon: 'report_problem'
        })
        return false
      }
    })
}
