<template>
  <q-card-section>
    <div
      v-if="user"
      class="row justify-center items-center content-center q-pa-xs bg-brand-4"
      style="border-radius: 10px;"
    >
      <div v-show="false">{{monitorCurrentTrack}}</div>
      <q-item class="col-12">
        <q-item-section side>
          <q-icon color="brand-7" name="volume_down" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="volume"
            :min="0"
            :max="100"
            dark
            color="brand-7"
            @change="updateVolume()"
          />
        </q-item-section>
        <q-item-section side>
          <q-icon color="brand-7" name="volume_up" />
        </q-item-section>
      </q-item>
      <q-item class="col-12">
        <q-item-section side>
          <q-item-label caption class="text-white">{{ progress | msToMin }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="progress"
            :min="0"
            :max="songDuration"
            dark
            color="brand-7"
            @change="updateProgress()"
          />
        </q-item-section>
        <q-item-section side>
          <q-item-label caption class="text-white">{{ songDuration | msToMin }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </q-card-section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Controls',
  data () {
    return {
      volume: 0,
      progress: 0,
      songDuration: 0
    }
  },
  computed: {
    ...mapGetters('spotify', ['currentTrack', 'user']),
    monitorCurrentTrack () {
      this.getCurrentState()
      return this.currentTrack
    }
  },
  filters: {
    msToMin: function (milliseconds) {
      const minutes = Math.floor(milliseconds / 60000)
      const seconds = ((milliseconds % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  },
  methods: {
    ...mapActions('spotify', ['loadCurrentTrack', 'playback', 'setVolume', 'setPlayback', 'loadSpotifyToken', 'refreshToken']),
    updateProgress () {
      this.setPlayback(this.progress).then(() => {
        this.getCurrentState()
      })
    },
    updateVolume () {
      this.setVolume(this.volume).then((response) => {
        if (response !== 204) {
          this.volume = 100
        }
      })
    },
    getCurrentState () {
      if (!this.user) return
      this.loadSpotifyToken().then(() => {
        this.playback().then((playbackStatus) => {
          if (!playbackStatus) return null
          if (playbackStatus.is_playing) {
            this.volume = playbackStatus.device.volume_percent
            clearInterval(this.secondInterval)
            this.progress = playbackStatus.progress_ms
            this.songDuration = playbackStatus.item.duration_ms
            this.songCountdown()
          }
        })
      })
    },
    songCountdown () {
      this.secondInterval = setInterval(() => {
        this.progress += 1000
        if (this.progress >= this.songDuration) {
          clearInterval(this.secondInterval)
          console.log('Song is done', this.progress, this.songDuration)
          this.loadCurrentTrack().then(() => {
            this.getCurrentState()
          })
        }
      }, 1000)
    }
  },
  created () {
    this.getCurrentState()
  }
}
</script>
