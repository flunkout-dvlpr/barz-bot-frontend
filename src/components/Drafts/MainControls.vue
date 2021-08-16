<template>
  <q-card class="q-ma-none q-pa-none">
    <q-card-section class="q-ma-none q-pa-none" v-if="playback">
      <div class="row justify-center items-center content-center">
        <div class="col-6">
          <q-btn
            flat
            square
            dense
            no-caps
            class="fit bg-brand-4"
            text-color="white"
            icon="notes"
            label="Lyrics"
            @click="showLyrics()"
            :loading="loadingLyrics"
          />
        </div>
        <div class="col-6">
          <q-btn
            flat
            square
            dense
            no-caps
            class="fit bg-brand-4"
            text-color="white"
            icon="sync"
            label="Sync"
            @click="refreshToken()"
          />
        </div>
<!--         <div class="col-4">
          <q-btn
            flat
            square
            dense
            no-caps
            class="fit bg-brand-4"
            :disable="!user"
            text-color="white"
            icon-right="videogame_asset"
            label="Controls"
            @click="getCurrentState"
          />
        </div> -->
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'MainControls',
  data () {
    return {
      loadingLyrics: false
    }
  },
  computed: {
    ...mapGetters('spotify', ['user']),
    ...mapGetters('genius', ['lyrics'])
  },
  methods: {
    ...mapActions('genius', ['loadLyrics']),
    ...mapActions('spotify', ['refreshToken', 'loadSpotifyToken', 'playback', 'loadCurrentTrack']),
    showLyrics () {
      this.loadingLyrics = true
      this.loadLyrics().then((result) => {
        console.log(result)
        this.loadingLyrics = false
        if (this.$route.name !== 'Lyrics') {
          this.$router.push({ name: 'Lyrics' })
        }
      })
      // if (this.lyrics) {
      //   console.log(this.lyrics)
      //   this.loadingLyrics = false
      //   if (this.$route.name !== 'Lyrics') {
      //     this.$router.push({ name: 'Lyrics' })
      //   } else {
      //     this.$router.push({ name: 'Home' })
      //   }
      // } else {
      //   this.loadLyrics().then((result) => {
      //     console.log(result)
      //     this.loadingLyrics = false
      //     this.$router.push({ name: 'Lyrics' })
      //   })
      // }
    },
    getCurrentState () {
      if (!this.user) return
      this.loadSpotifyToken().then(() => {
        this.loadCurrentTrack().then(() => {
          if (this.$route.name !== 'Controls') {
            this.$router.push({ name: 'Controls' })
          } else {
            this.$router.push({ name: 'Home' })
          }
        })
      })
    }
  }
}
</script>
