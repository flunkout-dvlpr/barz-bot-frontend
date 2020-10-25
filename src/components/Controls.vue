<template>
  <q-card-section>
    <div class="row">
      <div class="col-6" align="left">
        <q-btn
          class="q-ma-none"
          color="grey"
          flat
          dense
          icon="notes"
          label="Lyrics"
          @click="getLyrics()"
        />
      </div>
      <div class="col-6" align="right">
        <q-btn
          class="q-ma-none"
          color="grey"
          flat
          dense
          icon-right="videogame_asset"
          label="Controls"
          @click="loadControls()"
        />
      </div>
    </div>
    <div v-show="controls">
      <q-item class="row justify-center q-py-none">
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
      <q-item class="row justify-center q-py-none">
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
            @change="updateProgress()"
          />
        </q-item-section>
        <q-item-section side>
          <q-item-label caption class="text-white">{{ songDuration | msToMin }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div v-show="lyrics">
      <q-scroll-area style="height: 350px;">
        <div
          class="text-white"
          v-for="line in lyricsText"
          :key="line.id"
        >
          {{ line }}
        </div>
      </q-scroll-area>
    </div>
  </q-card-section>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Controls',
  data () {
    return {
      volume: 0,
      progress: 0,
      songDuration: 0,
      controls: false,
      lyrics: false,
      lyricsText: null
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
    ...mapActions('spotify', ['loadCurrentTrack', 'playback', 'setVolume', 'loadLyrics', 'setPlayback']),
    getLyrics () {
      this.$emit('hideCover')
      this.lyricsText = ''
      this.lyrics = !this.lyrics
      this.controls = false
      if (this.lyrics) {
        this.$q.loading.show()
        this.loadLyrics().then((lyrics) => {
          this.$q.loading.hide()
          if (lyrics) {
            this.lyricsText = lyrics.split(/\r\n|\r|\n/).filter(line => {
              if (line && !(line.includes('['))) {
                return line
              }
            })
          } else {
            this.lyrics = false
          }
        })
      }
    },
    updateProgress () {
      this.setPlayback(this.progress)
    },
    updateVolume () {
      this.setVolume(this.volume).then((response) => {
        if (response !== 204) {
          this.volume = 100
        }
      })
    },
    getCurrentState () {
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
    },
    loadControls () {
      this.controls = !this.controls
      this.lyrics = false
      this.getCurrentState()
    },
    songCountdown () {
      this.secondInterval = setInterval(() => {
        this.progress += 1000
        if (this.progress >= this.songDuration) {
          clearInterval(this.secondInterval)
          this.lyrics = false
          console.log('Song is done', this.progress, this.songDuration)
          this.loadCurrentTrack().then(() => {
            this.getCurrentState()
          })
        }
      }, 1000)
    }
    // playbackProgress () {
    //   setTimeout(() => {
    //     this.playback().then((playbackStatus) => {
    //       if (playbackStatus) {
    //         this.loadCurrentTrack()
    //         console.log(playbackStatus.device)
    //         this.volume = playbackStatus.device.volume_percent
    //         clearInterval(this.secondInterval)
    //         this.progress = playbackStatus.progress_ms
    //         this.songDuration = playbackStatus.item.duration_ms
    //         this.songCountdown()
    //         console.log('Progress', this.progress)
    //         console.log('Duration', this.songDuration)
    //       }
    //     })
    //   }, 1000)
    // }
  },
  created () {
    this.getCurrentState()
  }
}
</script>
