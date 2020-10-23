// import { getLyrics } from 'genius-lyrics-api'

export function loadAuthorizationCode ({ commit, state }) {
  var urlParameters = new URLSearchParams(window.location.search)
  if (urlParameters.get('code') && !state.token) {
    var authorizationCode = urlParameters.get('code')
    console.log('Loading authorization code')
    return authorizationCode
  } else {
    // An access token is already set
    return null
  }
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
        console.log('Loading token')
        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        commit('setToken', token)
        dispatch('spotify/loadUser', null, { root: true })
        dispatch('spotify/loadCurrentTrack', null, { root: true })
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

export function loadCurrentTrack ({ commit }) {
  return this._vm.$axios.get('https://api.spotify.com/v1/me/player/currently-playing')
    .then((response) => {
      if (response.status === 200) {
        var currentTrack = response.data
        console.log('Loading current track', currentTrack)
        commit('setCurrentTrack', currentTrack)
      }
    })
}

export function previous ({ dispatch }) {
  return this._vm.$axios.post('https://api.spotify.com/v1/me/player/previous')
    .then((response) => {
      if (response.status === 204) {
        console.log('Previous song')
        setTimeout(() => {
          console.log('Wait to load previous song')
          dispatch('spotify/loadCurrentTrack', null, { root: true })
        }, 300)
      }
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
}

export function play ({ dispatch }) {
  return this._vm.$axios.put('https://api.spotify.com/v1/me/player/play')
    .then((response) => {
      console.log('Playing', response)
      if (response.status === 204) {
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
      console.log(response)
      if (response.status === 204) {
        return response.status
      }
    })
    .catch((error) => {
      var device = state.playbackStatus.device.name
      this._vm.$q.notify({
        color: 'negative',
        position: 'top',
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
      }
    })
}

export async function loadLyrics ({ state }) {
  var trackName = state.currentTrack.item.name
  var trackArtist = state.currentTrack.item.artists.map(artist => artist.name)[0]
  const searchUrl = 'https://api.genius.com/search?q='
  // const token = '&access_token=eDCbzdAP1gOw5526VJfUPbU0B7DMmSk8EIN3AEXK6bEeL3r4fJKUJ53yl2_SXUWU'
  const song = `${trackName} ${trackArtist}`
  const reqUrl = `${searchUrl}${encodeURI(song)}` // ${token}`
  var options = {
    headers: {
      Authorization: 'Bearer eDCbzdAP1gOw5526VJfUPbU0B7DMmSk8EIN3AEXK6bEeL3r4fJKUJ53yl2_SXUWU',
      Accept: '*/*'
    }
  }
  // Create new axios instance without default headers (Authorization token)
  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization
  return instance.get(reqUrl, options).then((data) => {
    // var response = data.json()
    console.log(data)
    return data
  })
}
