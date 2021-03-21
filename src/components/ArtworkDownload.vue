<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card dark class="text-grey-1" style="width: 20rem">
      <q-card-section align="center" class="bg-accent">
        <span class="text-h6 q-ml-sm">Here's your artwork!</span>
      </q-card-section>
      <q-card-section>
        <q-img
          :src="url"
        />
      </q-card-section>
      <q-card-actions class="row justify-around bg-accent">
        <div class="col-3">
          <q-btn
            no-caps
            class="fit text-grey-1"
            label="Close"
            color="secondary"
            v-close-popup
          />
        </div>
        <div class="col-3">
          <q-btn
            no-caps
            class="fit text-grey-1"
            label="Download"
            color="secondary"
            type="a"
            target="_blank"
            :href="url"
          />
        </div>
        <div class="col-3">
          <q-btn
            no-caps
            class="fit text-grey-1"
            label="Tweet"
            color="secondary"
            type="a"
            target="_blank"
             :href="`https://twitter.com/intent/tweet?text=${lyricsText}&url=${twitterLink}`"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ArtworkDownload',
  props: {
    url: String,
    lyrics: Array
  },
  data () {
    return {
      twitterLink: null,
      lyricsText: null
    }
  },
  computed: {
    ...mapGetters('artist', ['artworkURL']),
    ...mapGetters('spotify', ['currentTrack'])
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    }
  },
  created () {
    var pathname = new URL(this.artworkURL).pathname
    var htmlPathName = pathname.replace('.jpeg', '.html')
    this.twitterLink = `https://images-barz-bot.s3.us-east-2.amazonaws.com${htmlPathName}`
    console.log(this.twitterLink)
    this.lyricsText = this.lyrics.map(lyric => lyric.text).join('%0D%0A')
    this.lyricsText = this.lyricsText.concat(`%0D%0A-${this.currentTrack.item.name} by ${this.currentTrack.item.artists[0].name}`)
    this.lyricsText = this.lyricsText.concat('%0D%0A@BarzBot%0D%0A')
    console.log(this.lyricsText)
  }
}
</script>
