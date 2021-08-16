// import cheerio from 'cheerio'
const token = 'UnTG00FLsgcgz_sM5hcxRrk5Wk0207GTXpo3M9f8RCY4G1QWYAT57C0vFbo_XLJ_'

export function searchSong ({ state, rootState, dispatch, commit }) {
  if (!rootState.spotify.currentTrack) return false
  const currentTrack = rootState.spotify.currentTrack.item
  const name = currentTrack.name.replace(/ *\([^)]*\) */g, '')
  const artist = currentTrack.artists.map(artist => artist.name)[0]
  const song = `${name} ${artist}`

  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization
  return instance.get(`https://api.genius.com/search?q=${encodeURI(song)}&access_token=${token}`)
    .then((response) => {
      dispatch('spotify/loadSpotifyToken', null, { root: true })
      if (!response.data.response.hits.length) return null
      const songURL = response.data.response.hits[0].result.url
      console.log('searchSong(): Successfully retrieved Genius song lyrics URL ->', songURL)
      if (songURL !== state.songURL) {
        commit('setSongURL', songURL)
        commit('setLyrics', ['Loading...'])
        dispatch('genius/loadLyrics', null, { root: true })
      }
    })
}

export function loadLyrics ({ state, dispatch, commit }) {
  var instance = this._vm.$axios.create()
  delete instance.defaults.headers.common.Authorization

  var apiBaseURL = process.env.PROD ? 'https://lnemptwhfl.execute-api.us-east-2.amazonaws.com/Prod' : 'http://127.0.0.1:3000'
  return instance.post(`${apiBaseURL}/genius/get-lyrics-by-url`, state.songURL)
    .then((response) => {
      dispatch('spotify/loadSpotifyToken', null, { root: true })
      var lyrics = response.data.payload
      console.log('loadLyrics(): Successfully retrieved Genius song lyrics text ->', lyrics)
      commit('setLyrics', lyrics)
      return lyrics
    })
}
