<template>
  <q-card class="q-ma-none q-pa-none">
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row justify-center items-center content-center bg-brand-4">
        <div class="col-5 q-ma-sm">
          <q-btn
            dense
            :disabled="!selected.length"
            no-caps
            class="fit"
            label="Create Art!"
            color="brand-7"
            icon="palette"
            @click="showArtwork()"
            :loading="loadingArtwork"
          />
        </div>
        <q-table
          dark
          flat
          square
          dense
          wrap-cells
          hide-header
          :hide-bottom="selected.length !== 0"
          no-data-label="Play a song!"
          hide-pagination
          virtual-scroll
          :rows-per-page-options="[0]"
          :columns="columns"
          :data="lyricsInRows"
          row-key="id"
          selection="multiple"
          :selected.sync="selected"
          :style="[{'max-height': $q.platform.is.mobile ? '375px' : '200px'}]"
          class="fit "
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import ArtworkDownload from 'components/ArtworkDownload'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Lyrics',
  data () {
    return {
      selected: [],
      loadingArtwork: false,
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
      ]
    }
  },
  computed: {
    ...mapGetters('spotify', ['currentTrack', 'user']),
    ...mapGetters('genius', ['lyrics']),
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
    resetSelection () {
      this.selected = []
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
    }
  }
}
</script>
