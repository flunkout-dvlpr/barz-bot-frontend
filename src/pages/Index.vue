<template>
  <q-page class="flex-start">
    <!-- MAKE A TILE BACKGROUND USING BARZ_BOT IG POSTS -->
    <div class="row full-width justify-center items-center content-center q-mt-sm">
      <div class="col-md-4 col-xs-11 q-pa-xs">
        <div class="col">
          <q-btn
            v-if="!user"
            no-caps
            type="a"
            color="brand-7"
            class="fit"
            label="Sync with Spotify"
            :href="authorizationURL"
          />
          <q-btn
            v-else
            no-caps
            color="brand-7"
            class="fit"
            text-color="white"
            icon="sync"
            label="Refresh"
            @click="refreshToken()"
          />
        </div>
        <User class="col"/>
        <SongSearch class="col"/>
        <TrackDetails class="col"/>
        <PlayerControls class="col"/>
        <PlayerSliders class="col"/>
      </div>
      <div class="col-md-4 col-xs-11 q-pa-xs">
        <TrackFrame class="col"/>
      </div>
    </div>
    <div class="row full-width justify-center items-center content-center q-mt-sm">
      <div class="col-md-8 col-xs-11 q-pa-xs">
        <Lyrics class="col"/>
      </div>
    </div>

<!--     <div class="row full-width justify-center items-center content-center">
      <div class="col-4">
        <User class="col"/>
      </div>
    </div>

    <div class="row full-width justify-center items-center content-center">
      <div class="col-4">
        <PlayerControls class="col"/>
      </div>
    </div>

    <div class="row full-width justify-center items-center content-center">
      <div class="col-4">
        <PlayerSliders class="col"/>
      </div>
    </div>

    <div class="row full-width justify-center items-center content-center">
      <div class="col-4">
        <TrackDetails class="col"/>
      </div>
    </div>

    <div class="row full-width justify-center items-center content-center">
      <div class="col-4">
        <TrackFrame class="col"/>
      </div>
    </div> -->
<!--       <div class="col-xs-11 col-sm-11 col-md-8 col-lg-4 col-xl-4">
        <q-card
          class="bg-brand-5"
          style="border-radius: 10px;"
        >
          <SpotifyTextSearch class="q-ma-none q-pt-md q-pb-sm"/>
          <SpotifyLinkSearch class="q-ma-none q-pt-none q-pb-sm"/>
          <q-card-section v-if="!user">
            <div
              class="row justify-center items-center content-center q-pa-xs bg-brand-4"
              style="border-radius: 10px;"
            >
              <div class="col-12 q-mb-xs">
                <div class="text-h8 text-center text-grey-3">Or Spotify Account!</div>
              </div>
              <div class="col-6 q-mb-xs">
                <q-btn
                  no-caps
                  type="a"
                  color="brand-7"
                  class="fit"
                  label="Sync with Spotify"
                  :href="authorizationURL"
                />
              </div>
            </div>
          </q-card-section>

          <User  class="q-ma-none q-py-none" v-if="user" />
          <Track class="q-ma-none q-pt-none q-pb-sm" v-if="currentTrack" />
          <Player class="q-ma-none q-pt-none q-pb-sm" v-if="token && user"/>
          <Settings class="q-ma-none q-pt-none q-pb-sm"/>
          <router-view class="q-ma-none q-pt-none q-pb-sm" />
          <Lyrics class="q-ma-none q-pt-none q-pb-sm"/>
          <Controls class="q-ma-none q-pt-none q-pb-md"/>
        </q-card>
      </div> -->
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import User from 'components/Spotify/User'
import SongSearch from 'components/Spotify/SongSearch'
import PlayerControls from 'components/Spotify/PlayerControls'
import PlayerSliders from 'components/Spotify/PlayerSliders'
import TrackDetails from 'components/Spotify/TrackDetails'
import TrackFrame from 'components/Spotify/TrackFrame'
import Lyrics from 'components/Lyrics'
export default {
  name: 'PageIndex',
  components: {
    User,
    SongSearch,
    PlayerControls,
    PlayerSliders,
    TrackDetails,
    TrackFrame,
    Lyrics
  },
  computed: {
    ...mapGetters('spotify', ['authorizationURL', 'token', 'user', 'currentTrack'])
  },
  methods: {
    ...mapActions('spotify', ['loadAuthorizationCode', 'loadAccessCode', 'loadAccessCodeFromClientCredentials', 'refreshToken']),
    hideCover () {
      console.log('Hide cover!')
      this.displayingLyrics = !this.displayingLyrics
    }
  },
  mounted () {
    if (!this.user) {
      this.loadAuthorizationCode().then((authorizationCode) => {
        if (authorizationCode) {
          this.loadAccessCode(authorizationCode)
        } else {
          this.loadAccessCodeFromClientCredentials()
        }
      })
    } else {
      this.refreshToken()
    }
  }
}
</script>
<style>
.q-btn--rectangle {
  border-radius: 0px !important;
}
</style>
