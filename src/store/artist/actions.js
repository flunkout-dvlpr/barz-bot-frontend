
export function createArtwork ({ rootState, dispatch }, payload) {
  var body = {
    user: rootState.spotify.user.display_name,
    imageURL: rootState.spotify.currentTrack.item.album.images[0].url,
    lyrics: payload
  }
  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization
  var apiBaseURL = process.env.PROD ? 'https://zwsuf4ozgj.execute-api.us-east-2.amazonaws.com/Prod' : 'http://127.0.0.1:3000'
  return instance.post(`${apiBaseURL}/artwork/create`, body).then((response) => {
    dispatch('spotify/loadSpotifyToken', null, { root: true })
    console.log(response)
  })
}
