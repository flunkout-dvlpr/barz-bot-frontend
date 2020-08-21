<template>
  <q-page class="column bg-dark flex flex-center">
    <q-btn
      v-if="token === ''"
      class="bg-secondary text-dark row q-ma-sm"
      type="a"
      label="Log in to Spotify"
      :href="authorizationURL"
    />
    <div v-if="token !== ''" class="row text-h2 text-white q-ma-sm">Wuz Up {{ user.display_name }}!</div>
    <q-btn
      v-if="token !== ''"
      class="bg-secondary text-dark row q-ma-sm"
      label="Get My Track"
      @click="getCurrentTrack()"
    />
    <div v-if="currentTrack !== ''" class="text-h4 text-white row q-ma-sm">You Yamming to:</div>
    <div v-if="currentTrack !== ''" class="text-h4 text-white row q-ma-sm">{{ currentTrack.item.name }}!</div>
    <q-img v-if="currentTrack !== ''" style="width: 300px" class="row q-ma-sm" :src="currentTrack.item.album.images[1].url"/>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      redirect_uri: 'http://localhost:8082/',
      client_id: 'ae6a056b5a2244b8b30e0a2cc3300c44',
      client_secret: '31ffe8ba96ea4b8aa7f67071c8e92d85',
      token: '',
      user: '',
      currentTrack: ''
    }
  },
  computed: {
    authorizationURL () {
      var authorizationParams = {
        client_id: this.client_id,
        response_type: 'code',
        redirect_uri: this.redirect_uri,
        show_dialog: false,
        scope: ['user-read-private', 'user-read-email', 'user-read-currently-playing']
      }
      const authorizationURL = 'https://accounts.spotify.com/authorize?' + new URLSearchParams(authorizationParams).toString()
      return authorizationURL
    },
    authorizationCode () {
      var urlParameters = new URLSearchParams(window.location.search)
      if (urlParameters.get('code')) {
        return urlParameters.get('code')
      }
      return false
    }
  },
  methods: {
    getAccess () {
      var body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: this.authorizationCode,
        redirect_uri: this.redirect_uri
      })
      var headers = {
        headers: {
          Authorization: 'Basic ' + btoa(this.client_id + ':' + this.client_secret)
        }
      }
      this.$axios.post('https://accounts.spotify.com/api/token', body.toString(), headers).then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          this.token = response.data.access_token
          this.getUserInfo()
        }
      })
    },
    getUserInfo () {
      var headers = {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      }
      this.$axios.get('https://api.spotify.com/v1/me', headers).then((response) => {
        console.log(response)
        if (response.status === 200) {
          this.user = response.data
        }
      })
    },
    getCurrentTrack () {
      var headers = {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      }
      return this.$axios.get('https://api.spotify.com/v1/me/player/currently-playing', headers)
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
            this.currentTrack = response.data
          }
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    }
  },
  mounted () {
    if (this.authorizationCode && this.token === '') {
      console.log(this.authorizationCode)
      this.getAccess()
    } else {
      console.log('No Code Fam')
    }
  }
}
</script>
