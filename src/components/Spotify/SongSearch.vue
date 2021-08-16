<template>
  <q-card class="q-ma-none q-pa-none">
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row justify-center items-center content-center bg-brand-4">
        <div class="col-12 q-mb-xs">
          <div class="q-px-md text-h8 text-white">Search Song On Spotify</div>
        </div>
        <div class="col-11 q-mb-xs">
          <q-select
            dark
            dense
            outlined
            clas="fit"
            color="brand-7"
            v-model="song"
            use-input
            fill-input
            clearable
            hide-selected
            hide-dropdown-icon
            input-debounce="0"
            label="Name"
            :options="searchResults"
            @filter="searchSong"
            @input="selectSong"
            @clear="clearSongSearch"
          >
            <template v-slot:prepend>
              <q-icon name="library_music" />
            </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-img :src="scope.opt.image" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.artist }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SongSearch',
  data () {
    return {
      songId: null,
      searchResults: [],
      song: {
        trackId: null,
        name: null,
        label: null,
        value: null,
        artist: null,
        image: null
      }
    }
  },
  computed: {
    ...mapGetters('spotify', ['user', 'token'])
  },
  methods: {
    ...mapActions('spotify', ['loadTracksFromSearch', 'loadTrackFromId', 'play']),
    clearSongSearch () {
      console.log('SongSearch: clearSongSearch()')
      this.song = {
        trackId: null,
        name: null,
        label: null,
        value: null,
        artist: null,
        image: null
      }
    },
    searchSong (val, update, abort) {
      console.log('SongSearch: searchSong()')
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        var searchValue = val.toLowerCase()
        this.loadTracksFromSearch(searchValue).then((searchResults) => {
          this.searchResults = searchResults.map(item => ({
            trackId: item.id,
            name: item.name,
            label: item.name,
            value: item.id,
            artist: item.artists[0].name,
            image: item.album.images[0].url
          }))
        })
      })
    },
    selectSong (selectedSong) {
      console.log('SongSearch: selectSong()')
      if (selectedSong) {
        this.song = { ...selectedSong }
        this.loadSong()
      }
    },
    loadSong () {
      console.log('SongSearch: trackId:', this.song.trackId)
      this.loadTrackFromId(this.song.trackId).then(() => {
        if (this.user) {
          this.play(this.song.trackId)
        }
      })
    }
  }
}
</script>
