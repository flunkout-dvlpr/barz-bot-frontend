
export function createArtwork ({ rootState, dispatch, commit }, payload) {
  var user = 'barzbot'
  if (rootState.spotify.user) {
    user = rootState.spotify.user.display_name
  }
  var body = {
    user: user,
    song: rootState.spotify.currentTrack.item.name,
    artist: rootState.spotify.currentTrack.item.artists[0].name,
    imageURL: rootState.spotify.currentTrack.item.album.images[0].url,
    lyrics: payload
  }
  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization
  var apiBaseURL = process.env.PROD ? 'https://lnemptwhfl.execute-api.us-east-2.amazonaws.com/Prod' : 'http://127.0.0.1:3000'
  return instance.post(`${apiBaseURL}/artwork/create`, body).then((response) => {
    dispatch('spotify/loadSpotifyToken', null, { root: true })
    commit('setArtworkURL', response.data.payload)
    return response.data.payload
  })
}
