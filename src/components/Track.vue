<template>
  <q-card-section>
    <q-img
      v-if="trackImage"
      :src="trackImage"
    />
    <div class="bg-primary" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
      <div class="q-px-md q-pt-sm text-h6 text-white">{{ trackName }}</div>
      <div class="q-px-md q-pb-sm text-subtitle2 text-white">by {{ trackArtists }}</div>
    </div>
  </q-card-section>
</template>

<script>
export default {
  name: 'Track',
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
