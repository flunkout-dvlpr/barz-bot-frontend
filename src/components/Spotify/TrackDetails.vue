<template>
  <q-card class="q-ma-none q-pa-none">
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row justify-center items-center content-center bg-brand-4">
        <div class="col-12">
          <div class="q-px-md q-pt-sm q-pb-none text-h6 text-white ellipsis">{{ trackName || 'Song Name' }}</div>
          <div class="q-px-md q-pt-none q-pb-sm text-subtitle2 text-white ellipsis">by {{ trackArtists || 'Artist'}}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TrackDetails',
  computed: {
    ...mapGetters('spotify', ['user', 'currentTrack']),
    trackName () {
      if (this.currentTrack) {
        var trackName = this.currentTrack.item.name
        if (trackName.includes('(')) {
          return trackName.substring(0, trackName.indexOf('('))
        }
        return trackName
      } else {
        return null
      }
    },
    trackArtists () {
      if (this.currentTrack) {
        var trackArtists = this.currentTrack.item.artists.map(artist => artist.name)
        if (trackArtists.length > 1) {
          return trackArtists[0] + ' ft. ' + trackArtists.slice(1).join(', ')
        }
        return trackArtists.join(', ')
      } else {
        return null
      }
    }
  }
}
</script>
