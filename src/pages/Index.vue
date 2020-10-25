<template>
  <q-page class="column flex flex-center bg-primary" style="height: auto;">
    <q-card class="bg-accent" style="width: 350px; border-radius: 10px;">
        <q-btn
          v-if="!token"
          class="bg-secondary text-primary row q-ma-sm"
          type="a"
          label="Log in to Spotify"
          :href="authorizationURL"
        />
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
          v-if="token"
          class="col q-ma-sm bg-primary"
          style="border-radius: 10px;"
          @hideCover="hideCover"
        />
        <Controls />
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
      displayingLyrics: false
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
    ...mapActions('spotify', ['loadAuthorizationCode', 'loadAccessCode', 'loadCurrentTrack']),
    hideCover () {
      console.log('Hide cover!')
      this.displayingLyrics = !this.displayingLyrics
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
