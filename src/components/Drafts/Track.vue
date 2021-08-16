<template>
  <q-card-section @click="showImage = !showImage">
    <div
      class="row justify-center items-center content-center q-pb-xs bg-brand-4"
      style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;"
    >
      <div class="col-12">
        <q-img
          v-if="trackImage && showImage"
          :src="trackImage"
          class="fit"
        />
      </div>
      <div class="col-12">
        <div class="q-px-md q-pt-sm q-pb-none text-h6 text-white">{{ trackName }}</div>
        <div class="q-px-md q-pt-none q-pb-sm text-subtitle2 text-white">by {{ trackArtists }}</div>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Track',
  data () {
    return {
      showImage: true
    }
  },
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
    },
    trackImage () {
      if (this.currentTrack) {
        return this.currentTrack.item.album.images[0].url
      } else {
        return null
      }
    }
  }
}
</script>

<style>

</style>
