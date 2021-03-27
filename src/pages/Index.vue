<template>
  <q-page class="row fit justify-center items-center content-center">
    <q-card
      class="q-ma-md q-pa-sm col-xs-12 col-sm-12 col-md-8 col-lg-4 col-xl-4 bg-accent"
      style="border-radius: 10px;"
    >
      <q-card-section class="q-pa-none q-mx-sm q-my-md">
        <div
          class="q-pa-sm row justify-center bg-primary"
          style="border-radius: 10px;"
        >
          <div class="q-mt-xs q-mb-none col-12 text-h8 text-center text-grey-3">
            Search Song On Spotify
          </div>
          <div class="q-my-xs col-12">
            <q-select
              dark
              outlined
              clas="fit"
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
          <div class="q-mt-xs q-mb-none col-12 text-h8 text-center text-grey-3">
            Or Use Spotify Song Share Link
          </div>
          <div class="q-mt-none q-mb-xs col-12 justify-center">
            <q-input
              dark
              outlined
              v-model="songURL"
              class="fit"
              color="secondary"
              label="Link"
              placeholder="https://open.spotify.com/track/trackId"
              @input="lookUpSong"
            >
              <template v-slot:prepend>
                <q-icon name="ios_share" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none q-mx-sm q-my-md" v-if="!user">
        <div
          class="q-pa-sm row justify-center bg-primary"
          style="border-radius: 10px;"
        >
          <div class="q-my-xs col-12 text-h8 text-center text-grey-3">
            Or Spotify Account!
          </div>
          <div class="q-my-xs col-6">
            <q-btn
              no-caps
              type="a"
              color="secondary"
              class="fit text-black"
              label="Sync with Spotify"
              :href="authorizationURL"
            />
          </div>
        </div>
      </q-card-section>
      <User
        v-if="user"
        :user="user"
      />
      <Track
        v-if="currentTrack && !displayingLyrics"
        :track="currentTrack"
      />
      <Player
        v-if="token && user"
        @hideCover="hideCover"
      />
      <Controls/>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import User from 'components/User'
import Track from 'components/Track'
import Player from 'components/Player'
import Controls from 'components/Controls'
export default {
  name: 'PageIndex',
  data () {
    return {
      displayingLyrics: false,
      songURL: null,
      songId: null,
      song: {
        trackId: null,
        name: null,
        label: null,
        value: null,
        artist: null,
        image: null
      },
      songArtist: null,
      searchResults: []
    }
  },
  components: {
    User,
    Track,
    Player,
    Controls
  },
  computed: {
    ...mapGetters('spotify', ['authorizationURL', 'token', 'user', 'currentTrack'])
  },
  methods: {
    ...mapActions('spotify', ['loadAuthorizationCode', 'loadAccessCode', 'loadAccessCodeFromClientCredentials', 'loadCurrentTrack', 'loadTrackFromId', 'loadTracksFromSearch']),
    clearSongSearch () {
      console.log('cleared song')
      this.song = {
        trackId: null,
        name: null,
        label: null,
        value: null,
        artist: null,
        image: null
      }
      this.songId = null
    },
    clearSongURL () {
      this.songURL = null
    },
    hideCover () {
      console.log('Hide cover!')
      this.displayingLyrics = !this.displayingLyrics
    },
    searchSong (val, update, abort) {
      this.clearSongURL()
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
    selectSong (song) {
      if (song) {
        this.song = song
        this.songId = song.trackId
        this.lookUpSong()
      }
    },
    lookUpSong () {
      // https://open.spotify.com/track/49nkBg3OJtp6m6TQPmG1Qw?si=pU9ZPDrERaq88I8FAix9BQ
      if (this.songURL) {
        this.clearSongSearch()
        var trackId = new URL(this.songURL).pathname.replace('/track/', '')
        console.log(trackId)
        this.loadTrackFromId(trackId)
      } else if (this.songId) {
        this.loadTrackFromId(this.songId)
      }
    }
  },
  mounted () {
    this.loadAuthorizationCode().then((authorizationCode) => {
      if (authorizationCode) {
        console.log('code')
        this.loadAccessCode(authorizationCode)
      } else {
        console.log('no code')
        this.loadAccessCodeFromClientCredentials()
      }
    })
  }
}
</script>
