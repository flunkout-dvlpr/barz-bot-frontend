<template>
  <q-card-section class="q-pa-none q-mx-sm q-mb-md" @click="showImage = !showImage">
    <div
      class="row justify-center bg-primary"
      style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;"
    >
      <q-img
        v-if="trackImage && showImage"
        :src="trackImage"
        class="fit"
      />
      <div class="fit">
        <div class="q-px-md q-pt-sm q-bg-none text-h6 text-white">{{ trackName }}</div>
        <div class="q-px-md q-pt-none q-pb-sm text-subtitle2 text-white">by {{ trackArtists }}</div>
      </div>
    </div>
  </q-card-section>
</template>

<script>
export default {
  name: 'Track',
  data () {
    return {
      showImage: true
    }
  },
  props: {
    track: Object
  },
  computed: {
    trackName () {
      if (this.track) {
        var trackName = this.track.item.name
        if (trackName.includes('(')) {
          return trackName.substring(0, trackName.indexOf('('))
        }
        return trackName
      } else {
        return null
      }
    },
    trackArtists () {
      if (this.track) {
        var trackArtists = this.track.item.artists.map(artist => artist.name)
        if (trackArtists.length > 1) {
          return trackArtists[0] + ' ft. ' + trackArtists.slice(1).join(', ')
        }
        return trackArtists.join(', ')
      } else {
        return null
      }
    },
    trackImage () {
      if (this.track) {
        return this.track.item.album.images[0].url
      } else {
        return null
      }
    }
  }
}
</script>

<style>

</style>
