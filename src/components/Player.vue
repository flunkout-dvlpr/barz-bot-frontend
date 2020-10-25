<template>
  <q-card-section>
    <div class="row justify-center">
      <div>
        <q-btn
          round
          size="md"
          class="col-4 bg-secondary text-primary q-mx-md"
          icon="skip_previous"
          @click="previous()"
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
  methods: {
    ...mapActions('spotify', ['playback', 'previous', 'next', 'play', 'pause']),
    playbackControl () {
      this.playback().then((playbackStatus) => {
        if (!playbackStatus) return null
        if (playbackStatus.is_playing) {
          this.pause()
        } else {
          this.play()
        }
      })
    }
  }
}
</script>

<style>

</style>
