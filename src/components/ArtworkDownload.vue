<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card dark class="text-grey-1" style="width: 365px;">
      <q-card-section align="center" class="bg-accent">
        <span class="text-h6 q-ml-sm">Here's your artwork!</span>
      </q-card-section>
      <q-card-section class="row items-center">
        <q-img
          :src="url"
        />
      </q-card-section>
      <q-card-actions align="right" class="bg-accent">
        <q-btn class="text-grey-1" label="Cancel" color="secondary" v-close-popup />
        <q-btn
          class="text-grey-1"
          label="Download"
          color="secondary"
          type="a"
          target="_blank"
          :href="url"
          v-close-popup
        />
        <q-btn
          class="text-grey-1"
          label="Tweet"
          color="secondary"
          type="a"
          target="_blank"
           :href="`https://twitter.com/intent/tweet?url=${twitterLink}`"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ArtworkDownload',
  props: {
    url: String
  },
  data () {
    return {
      twitterLink: null
    }
  },
  computed: {
    ...mapGetters('artist', ['artworkURL'])
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
    this.twitterLink = `https://s3.us-east-2.amazonaws.com/webapp-barz-bot/index.html#/artwork${pathname}`
    console.log(this.twitterLink)
  }
}
</script>
