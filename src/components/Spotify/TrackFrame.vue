<template>
  <q-card class="q-ma-none q-pa-none">
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row justify-center items-center content-center">
        <img
          id="trackArtwork"
          ref="trackArtwork"
          v-if="trackImage && showImage"
          :src="trackImage"
          class="fit"
        >
        <q-icon
          v-else
          name="music_note"
          color="brand-7"
          class="fit bg-brand-5"
          :size="$q.platform.is.mobile ? '320px' : '310px'"
        />
      </div>
      <div class="row fit justify-center items-center content-center">
        <div
          class="col"
          v-for="(color, idx) in palette"
          :key="idx"
        >
          <div class="text-center" :style="`background: ${color};`">{{idx}}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import ColorThief from 'colorthief'
import { mapGetters } from 'vuex'
export default {
  name: 'TrackFrame',
  data () {
    return {
      showImage: true,
      palette: []
    }
  },
  computed: {
    ...mapGetters('spotify', ['user', 'currentTrack']),
    trackImage () {
      if (this.currentTrack) {
        return this.currentTrack.item.album.images[0].url
      } else {
        return null
      }
    },
    colors () {
      if (this.palette.length) {
        return this.palette
      } else {
        return 'black'
      }
    }
  },
  methods: {
    extractColors () {
      const img = document.querySelector('#trackArtwork')
      const colorThief = new ColorThief()
      const imgColors = colorThief.getPalette(img)
      this.palette = []
      imgColors.sort(function (a, b) { return a[0] - b[0] }).forEach((color, idx) => {
        if (idx % 2) {
          this.palette.push(`rgb(${color.join()}) ${idx * 10}%`)
        }
      })
      console.log(this.palette)
      const gradeints = [
        // `linear-gradient(45deg, ${this.palette[0]}, ${this.palette[1]})`,
        // `linear-gradient(65deg, ${this.palette[2]}, ${this.palette[3]})`,
        // `linear-gradient(85deg, ${this.palette[4]}, ${this.palette[5]})`,
        // `linear-gradient(45deg, ${this.palette[0]}, ${this.palette[3]})`,
        `linear-gradient(135deg, ${this.palette.join()})`
        // `radial-gradient(circle, ${this.palette[0]}, ${this.palette[9]})`
      ]
      console.log(gradeints)
      document.getElementById('q-app').style.background = gradeints.join()
    }
  },
  updated () {
    this.$nextTick(() => {
      const img = document.querySelector('#trackArtwork')
      img.setAttribute('crossOrigin', '*')
      img.addEventListener('load', this.extractColors, true)
    })
  }
}
</script>

<style lang="scss">
.img-frame {
  border: 20px solid black;
}
.spotify-gradient {
  background: linear-gradient(46deg, $primary, $secondary, $accent);
  background-size: 600% 600%;

  -webkit-animation: AnimationName 30s ease infinite;
  -moz-animation: AnimationName 30s ease infinite;
  animation: AnimationName 30s ease infinite;
}

@-webkit-keyframes AnimationName {
  0%{background-position:90% 0%}
  50%{background-position:11% 100%}
  100%{background-position:90% 0%}
}
@-moz-keyframes AnimationName {
  0%{background-position:90% 0%}
  50%{background-position:11% 100%}
  100%{background-position:90% 0%}
}
@keyframes AnimationName {
  0%{background-position:90% 0%}
  50%{background-position:11% 100%}
  100%{background-position:90% 0%}
}
</style>
