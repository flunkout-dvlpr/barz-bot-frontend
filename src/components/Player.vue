<template>
  <q-card-section>
    <div class="row justify-center">
      <div>
        <q-btn
          round
          size="md"
          class="col-4 bg-secondary text-primary q-mx-md"
          icon="skip_previous"
          @click="previousControl()"
        />
      </div>
      <div>
        <q-btn
          round
          size="md"
          class="col-4 bg-secondary text-primary q-mx-md"
          icon="play_arrow"
          @click="playbackControl()"
        />
      </div>
      <div>
        <q-btn
          round
          size="md"
          class="col-4 bg-secondary text-primary q-mx-md"
          icon="skip_next"
          @click="nextControl()"
        />
      </div>
    </div>
    <div align="right">
      <q-btn
        color="grey"
        flat
        dense
        :icon="expanded ? 'videogame_asset' : 'videogame_asset'"
        @click="expanded = !expanded"
      />
    </div>
    <q-item class="row justify-center" v-show="expanded">
      <q-item-section side>
        <q-icon color="secondary" name="volume_down" />
      </q-item-section>
      <q-item-section>
        <q-slider
          v-model="volume"
          :min="0"
          :max="100"
          dark
          color="secondary"
          @change="updateVolume()"
        />
      </q-item-section>
      <q-item-section side>
        <q-icon color="secondary" name="volume_up" />
      </q-item-section>
    </q-item>
    <q-item class="row justify-center" v-show="expanded">
      <q-item-section side>
        <q-item-label caption class="text-white">{{ progress | msToMin }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-slider
          v-model="progress"
          :min="0"
          :max="songDuration"
          dark
          color="secondary"
          label
        />
      </q-item-section>
      <q-item-section side>
        <q-item-label caption class="text-white">{{ songDuration | msToMin }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card-section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Player',
  data () {
    return {
      volume: 0,
      progress: 0,
      songDuration: 0,
      expanded: false
    }
  },
  filters: {
    msToMin: function (milliseconds) {
      const minutes = Math.floor(milliseconds / 60000)
      const seconds = ((milliseconds % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  },
  computed: {
    ...mapGetters('spotify', ['currentTrack'])
  },
  methods: {
    ...mapActions('spotify', ['loadCurrentTrack', 'playback', 'previous', 'next', 'play', 'pause', 'setVolume']),
    updateVolume () {
      this.setVolume(this.volume)
    },
    songCountdown () {
      this.secondInterval = setInterval(() => {
        this.progress += 1000
        if (this.progress >= this.songDuration) {
          clearInterval(this.secondInterval)
          console.log('Song is done', this.progress, this.songDuration)
          this.playbackProgress()
        }
      }, 1000)
    },
    playbackProgress () {
      setTimeout(() => {
        this.playback().then((playbackStatus) => {
          this.volume = playbackStatus.device.volume_percent
          clearInterval(this.secondInterval)
          this.progress = playbackStatus.progress_ms
          this.songDuration = playbackStatus.item.duration_ms
          this.songCountdown()
          console.log('Progress', this.progress)
          console.log('Duration', this.songDuration)
        })
      }, 1000)
    },
    nextControl () {
      this.next().then(() => {
        this.playbackProgress()
      })
    },
    previousControl () {
      this.previous().then(() => {
        this.playbackProgress()
      })
    },
    playbackControl () {
      this.playback().then((playbackStatus) => {
        if (playbackStatus.is_playing) {
          this.volume = playbackStatus.device.volume_percent
          clearInterval(this.secondInterval)
          this.pause()
        } else {
          this.volume = playbackStatus.device.volume_percent
          this.play()
          this.playbackProgress()
        }
      })
    }
  },
  created () {
    this.playback().then((playbackStatus) => {
      if (playbackStatus.is_playing) {
        this.volume = playbackStatus.device.volume_percent
        this.playbackProgress()
      }
    })
  }
}
</script>

<style>

</style>
