export default function () {
  return {
    redirect_uri: process.env.PROD ? 'http://barzbot.app.s3-website.us-east-2.amazonaws.com/#/' : 'http://localhost:8080/',
    client_id: 'ae6a056b5a2244b8b30e0a2cc3300c44',
    client_secret: '31ffe8ba96ea4b8aa7f67071c8e92d85',
    token: null,
    user: null,
    currentTrack: null,
    playbackStatus: null
  }
}
