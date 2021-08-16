<template>
  <q-card-section>
    <div
      class="row justify-center items-center content-center q-pa-xs bg-brand-4"
      style="border-radius: 10px;"
    >
      <div class="col-10 q-mb-xs">
        <div class="text-h8 text-center text-grey-3">Or Use Spotify Song Share Link</div>
      </div>
      <div class="col-10 q-mb-xs">
        <q-input
          dark
          dense
          outlined
          v-model="songURL"
          class="fit"
          color="brand-7"
          label="Link"
          placeholder="https://open.spotify.com/track/track-id"
          @input="loadSong"
        >
          <template v-slot:prepend>
            <q-icon name="ios_share" />
          </template>
        </q-input>
      </div>
    </div>
  </q-card-section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SpotifyLinkSearch',
  data () {
    return {
      songURL: null
    }
  },
  computed: {
    ...mapGetters('spotify', ['user', 'token'])
  },
  methods: {
    ...mapActions('spotify', ['loadTrackFromId', 'play']),
    loadSong () {
      console.log('SpotifyLinkSearch: TOKEN USED:', this.token)
      console.log('SpotifyLinkSearch: loadSong()')
      if (this.songURL && this.songURL.replace(/ /g, '') !== '') {
        var trackId = new URL(this.songURL).pathname.replace('/track/', '')
        console.log('SpotifyLinkSearch: trackId:', trackId)
        this.loadTrackFromId(trackId).then(() => {
          if (this.user) {
            this.play(trackId)
          }
        })
      }
    }
  }
}
</script>
