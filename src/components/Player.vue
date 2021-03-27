<template>
  <q-card-section class="q-pa-none q-mx-sm q-my-md">
    <div
      class="row justify-center bg-primary"
      style="border-radius: 10px;"
    >
      <div class="q-pa-sm col-3 column items-center content-center">
        <q-btn
          round
          class="bg-secondary"
          icon="skip_previous"
          @click="previous()"
        />
      </div>
      <div class="q-pa-sm col-3 column items-center content-center">
        <q-btn
          round
          class="bg-secondary"
          :icon="playIcon"
          @click="playbackControl()"
        />
      </div>
      <div class="q-pa-sm col-3 column items-center content-center">
        <q-btn
          round
          class="bg-secondary"
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
      playIcon: 'play_arrow'
    }
  },
  methods: {
    ...mapActions('spotify', ['playback', 'previous', 'next', 'play', 'pause']),
    playbackControl () {
      this.playback().then((playbackStatus) => {
        if (!playbackStatus) return null
        if (playbackStatus.is_playing) {
          this.pause()
          this.playIcon = 'play_arrow'
        } else {
          this.play()
          this.playIcon = 'pause'
        }
      })
    }
  }
}
</script>

<style>

</style>
