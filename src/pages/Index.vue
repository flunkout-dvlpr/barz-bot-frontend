<template>
  <q-page class="column flex flex-center bg-primary" style="height: auto;">
    <q-card class="q-my-md bg-accent" style="width: 350px; border-radius: 10px;">
        <q-btn
          no-caps
          v-if="!user"
          class="bg-secondary text-primary row q-ma-sm"
          type="a"
          label="Log in to Spotify"
          :href="authorizationURL"
        />
        <q-input
          dark
          outlined
          v-model="songURL"
          class="row q-ma-sm"
          label="Or Paste Spotify Song Link"
          placeholder="https://open.spotify.com/track/trackID"
          @input="lookUpSong"
        >
          <template v-slot:prepend>
            <q-icon name="link" />
          </template>
        </q-input>
        <User
          v-if="user"
          class="col q-pa-none q-mx-sm q-mt-sm"
          :user="user"
        />
        <Track
          v-if="currentTrack && !displayingLyrics"
          class="col q-pa-none q-mx-sm"
          :track="currentTrack"
        />
        <Player
          v-if="token && user"
          class="col q-ma-sm bg-primary"
          style="border-radius: 10px;"
          @hideCover="hideCover"
        />
        <Controls
          v-if="token"
        />
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import User from 'components/User'
import Track from 'components/Track'
import Player from 'components/Player'
import Controls from 'components/Controls'
export default {
  name: 'PageIndex',
  data () {
    return {
      displayingLyrics: false,
      songURL: null
    }
  },
  components: {
    User,
    Track,
    Player,
    Controls
  },
  computed: {
    ...mapGetters('spotify', ['authorizationURL', 'token', 'user', 'currentTrack'])
  },
  methods: {
    ...mapActions('spotify', ['loadAuthorizationCode', 'loadAccessCode', 'loadAccessCodeFromClientCredentials', 'loadCurrentTrack', 'loadTrackFromId']),
    hideCover () {
      console.log('Hide cover!')
      this.displayingLyrics = !this.displayingLyrics
    },
    lookUpSong (url) {
      // https://open.spotify.com/track/49nkBg3OJtp6m6TQPmG1Qw?si=pU9ZPDrERaq88I8FAix9BQ
      var trackId = new URL(url).pathname.replace('/track/', '')
      if (!this.token) {
        console.log('Loading Access Code From Client Credentials')
        this.loadAccessCodeFromClientCredentials().then((response) => {
          this.loadTrackFromId(trackId)
        })
      }
      this.loadTrackFromId(trackId)
    }
  },
  mounted () {
    this.loadAuthorizationCode().then((authorizationCode) => {
      if (authorizationCode) {
        this.loadAccessCode(authorizationCode)
      }
    })
  }
}
</script>
