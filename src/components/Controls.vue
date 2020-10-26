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
          @click="showLyrics()"
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
    <div v-show="displayLyrics && lyrics">
      <div align="center" v-show="selected.length">
        <q-btn
          size="sm"
          class="q-ma-sm"
          label="Create Art!"
          color="secondary"
        />
      </div>
      <q-table
        dark
        dense
        wrap-cells
        hide-header
        hide-pagination
        virtual-scroll
        :rows-per-page-options="[0]"
        :columns="columns"
        :data="lyricsInRows"
        row-key="id"
        selection="multiple"
        :selected.sync="selected"
        style="max-width: 375px; max-height: 350px;"
      />
    </div>
  </q-card-section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Controls',
  data () {
    return {
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Lines',
          align: 'center',
          field: row => row.line,
          format: val => `${val}`,
          sortable: false
        }
      ],
      selected: [],
      volume: 0,
      progress: 0,
      songDuration: 0,
      controls: false,
      displayLyrics: false
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
    ...mapGetters('genius', ['lyrics']),
    lyricsInRows () {
      this.resetSelection()
      if (this.lyrics) {
        return this.lyrics.filter(line => {
          if (line && !(line.includes('['))) {
            return line
          }
        }).map((line, idx) => ({ line: line, id: idx }))
      }
      return []
    }
  },
  methods: {
    ...mapActions('spotify', ['loadCurrentTrack', 'playback', 'setVolume', 'setPlayback']),
    resetSelection () {
      this.selected = []
    },
    showLyrics () {
      this.displayLyrics = !this.displayLyrics
      this.controls = false
    },
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
      this.displayLyrics = false
      this.getCurrentState()
    },
    songCountdown () {
      this.secondInterval = setInterval(() => {
        this.progress += 1000
        if (this.progress >= this.songDuration) {
          clearInterval(this.secondInterval)
          this.displayLyrics = false
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
