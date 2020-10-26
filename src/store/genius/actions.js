// import cheerio from 'cheerio'
const token = 'UnTG00FLsgcgz_sM5hcxRrk5Wk0207GTXpo3M9f8RCY4G1QWYAT57C0vFbo_XLJ_'

export function searchSong ({ rootState, dispatch, commit }) {
  if (!rootState.spotify.currentTrack) return false
  var name = rootState.spotify.currentTrack.item.name
  var artist = rootState.spotify.currentTrack.item.artists.map(artist => artist.name)[0]
  var song = `${name} ${artist}`

  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization
  return instance.get(`https://api.genius.com/search?q=${encodeURI(song)}&access_token=${token}`).then((request) => {
    dispatch('spotify/loadSpotifyToken', null, { root: true })
    if (request.data.response.hits.length === 0) return null
    var songURL = request.data.response.hits[0].result.url
    commit('setSongURL', songURL)
  })
}

export function loadLyrics ({ state, dispatch, commit }) {
  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization

  var apiBaseURL = process.env.PROD ? 'https://zwsuf4ozgj.execute-api.us-east-2.amazonaws.com/Prod' : 'http://127.0.0.1:3000'
  return instance.post(`${apiBaseURL}/genius/get-lyrics-by-url`, state.songURL).then((response) => {
    dispatch('spotify/loadSpotifyToken', null, { root: true })
    var lyrics = response.data.payload
    commit('setLyrics', lyrics)
    return lyrics
  })
}
