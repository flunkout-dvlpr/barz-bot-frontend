// import cheerio from 'cheerio'
const token = 'UnTG00FLsgcgz_sM5hcxRrk5Wk0207GTXpo3M9f8RCY4G1QWYAT57C0vFbo_XLJ_'

export function searchSong ({ rootState, dispatch, commit }) {
  console.log('--------- LOADING SONG URL ---------')
  if (!rootState.spotify.currentTrack) return false
  var name = rootState.spotify.currentTrack.item.name
  var artist = rootState.spotify.currentTrack.item.artists.map(artist => artist.name)[0]
  var song = `${name} ${artist}`

  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization
  return instance.get(`https://api.genius.com/search?q=${encodeURI(song)}&access_token=${token}`).then((request) => {
    if (request.data.response.hits.length === 0) return null
    var songURL = request.data.response.hits[0].result.url
    dispatch('spotify/loadSpotifyToken', null, { root: true })
    commit('setSongURL', songURL)
    dispatch('genius/loadLyrics', null, { root: true })
    console.log(`--------- SONG URL ${songURL} ---------`)
  })
}

export function loadLyrics ({ state, dispatch, commit }) {
  console.log('--------- SCRAPING SONG LYRICS ---------')
  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization

  return instance.post('https://zwsuf4ozgj.execute-api.us-east-2.amazonaws.com/Prod/genius/get-lyrics-by-url', state.songURL).then((response) => {
    var lyrics = response.data.payload
    dispatch('spotify/loadSpotifyToken', null, { root: true })
    commit('setLyrics', lyrics)
    return lyrics
  })
}
