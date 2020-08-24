
export function authorizationURL (state) {
  var authorizationParams = {
    client_id: state.client_id,
    redirect_uri: state.redirect_uri,
    response_type: 'code',
    show_dialog: false,
    scope: ['user-read-private', 'user-read-email', 'user-read-currently-playing', 'user-modify-playback-state', 'user-read-playback-state']
  }
  const authorizationURL = 'https://accounts.spotify.com/authorize?' + new URLSearchParams(authorizationParams).toString()
  return authorizationURL
}

export function token (state) {
  return state.token
}

export function user (state) {
  return state.user
}

export function currentTrack (state) {
  return state.currentTrack
}

export function playbackStatus (state) {
  return state.playbackStatus
}
