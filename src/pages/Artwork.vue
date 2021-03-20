<template>
  <q-page class="column flex flex-center bg-primary" style="height: auto;">
    <q-card class="q-my-md bg-accent" style="width: 350px; border-radius: 10px;">
      <q-img
        :src="`https://images-barz-bot.s3.us-east-2.amazonaws.com/${spotifyUser}/${imageId}`"
      />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'Artwork',
  metaInfo () {
    const su = this.$route.params.spotifyUser
    const imgId = this.$route.params.imageId
    return {
      meta: [
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        // {
        //   name: 'twitter:site',
        //   content: '@site_username'
        // },
        {
          name: 'twitter:title',
          content: 'Created Using BarzBot!'
        },
        {
          name: 'twitter:description',
          content: 'Song Name - Artist'
        },
        // {
        //   name: 'twitter:creator',
        //   content: '@creator_username'
        // },
        {
          name: 'twitter:image',
          content: `https://images-barz-bot.s3.us-east-2.amazonaws.com/${su}/${imgId}`
        },
        {
          name: 'twitter:domain',
          content: `https://s3.us-east-2.amazonaws.com/webapp-barz-bot/index.html#/artwork/${su}/${imgId}`
        }
      ]
    }
  },
  created () {
    this.spotifyUser = this.$route.params.spotifyUser
    this.imageId = this.$route.params.imageId
  }
}
</script>
