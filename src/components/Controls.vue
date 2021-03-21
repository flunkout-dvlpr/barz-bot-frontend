<template>
  <q-card-section>
    <div class="row">
      <div v-show="false">{{monitorCurrentTrack}}</div>
      <div class="col-6" align="left">
        <q-btn
          no-caps
          class="q-ma-none"
          color="grey"
          flat
          dense
          icon="notes"
          label="Lyrics"
          @click="showLyrics()"
          :loading="loadingLyrics"
        />
      </div>
      <div class="col-6" align="right">
        <q-btn
          no-caps
          :disable="!user"
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
          no-caps
          size="sm"
          class="q-ma-sm"
          label="Create Art!"
          color="secondary"
          @click="showArtwork()"
          :loading="loadingArtwork"
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
import ArtworkDownload from 'components/ArtworkDownload'
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
          field: row => row.text,
          format: val => `${val}`,
          sortable: false
        }
      ],
      selected: [],
      volume: 0,
      progress: 0,
      songDuration: 0,
      controls: false,
      displayLyrics: false,
      loadingArtwork: false,
      loadingLyrics: false
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
    ...mapGetters('spotify', ['currentTrack', 'user']),
    ...mapGetters('genius', ['lyrics']),
    monitorCurrentTrack () {
      this.getCurrentState()
      return this.currentTrack
    },
    lyricsInRows () {
      this.resetSelection()
      if (this.lyrics) {
        return this.lyrics.filter(line => {
          if (line && !(line.includes('['))) {
            return line
          }
        }).map((line, idx) => ({ text: line, id: idx }))
      }
      return []
    }
  },
  methods: {
    ...mapActions('artist', ['createArtwork']),
    ...mapActions('genius', ['loadLyrics']),
    ...mapActions('spotify', ['loadCurrentTrack', 'playback', 'setVolume', 'setPlayback', 'loadSpotifyToken']),
    resetSelection () {
      this.selected = []
    },
    showLyrics () {
      this.loadingLyrics = true
      if (this.lyrics) {
        this.getCurrentState()
        this.loadingLyrics = false
        this.displayLyrics = !this.displayLyrics
        this.controls = false
      } else {
        this.loadLyrics().then(() => {
          this.loadingLyrics = false
          this.displayLyrics = !this.displayLyrics
          this.controls = false
          this.getCurrentState()
        })
      }
    },
    showArtwork () {
      this.loadingArtwork = true
      this.createArtwork(this.selected).then((response) => {
        this.loadingArtwork = false
        this.$q.dialog({
          component: ArtworkDownload,
          parent: this,
          url: response,
          lyrics: this.selected
        })
      })
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
