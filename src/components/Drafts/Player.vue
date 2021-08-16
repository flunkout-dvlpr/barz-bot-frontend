<template>
  <q-card-section>
    <div
      class="row justify-center items-center content-center q-pa-xs bg-brand-4"
      style="border-radius: 10px;"
    >
      <div class="col-3 column items-center content-center q-pa-sm">
        <q-btn
          round
          class="bg-brand-7"
          icon="skip_previous"
          @click="previous()"
        />
      </div>
      <div class="col-3 column items-center content-center q-pa-sm">
        <q-btn
          round
          class="bg-brand-7"
          :icon="trackIsPlaying ? 'pause' : 'play_arrow'"
          @click="playbackControl()"
        />
      </div>
      <div class="col-3 column items-center content-center q-pa-sm">
        <q-btn
          round
          class="bg-brand-7"
          icon="skip_next"
          @click="next()"
        />
      </div>
    </div>
  </q-card-section>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Player',
  data () {
    return {
      status: true
    }
  },
  computed: {
    trackIsPlaying () {
      if (this.status) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions('spotify', ['playback', 'previous', 'next', 'play', 'pause']),
    playbackControl () {
      this.playback().then((playbackStatus) => {
        if (playbackStatus) {
          if (playbackStatus.is_playing) {
            this.status = false
            this.pause()
          } else {
            this.status = true
            this.play()
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
