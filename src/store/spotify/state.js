export default function () {
  return {
    redirect_uri: process.env.PROD ? 'https://www.barzbot.app/#' : 'http://localhost:8080/',
    client_id: 'ae6a056b5a2244b8b30e0a2cc3300c44',
    client_secret: '31ffe8ba96ea4b8aa7f67071c8e92d85',
    refreshToken: null,
    token: null,
    user: null,
    currentTrack: null,
    playbackStatus: null
  }
}
