<template>
  <q-page class="column flex flex-center bg-primary" style="height: auto;">
    <q-card class="q-my-md bg-accent" style="width: 350px; border-radius: 10px;">
      <q-img
        :src="`https://images-barz-bot.s3.us-east-2.amazonaws.com/${spotifyUser}/${imageId}`"
      />
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@site_username">
      <meta name="twitter:title" content="Top 10 Things Ever">
      <meta name="twitter:description" content="Up than 200 characters.">
      <meta name="twitter:creator" content="@creator_username">
      <!-- <meta name="twitter:image" content="http://placekitten.com/250/250"> -->
      <meta name="twitter:image" :content="`https://images-barz-bot.s3.us-east-2.amazonaws.com/${spotifyUser}/${imageId}`">
      <meta name="twitter:domain" :content="`https://images-barz-bot.s3.us-east-2.amazonaws.com/${spotifyUser}/${imageId}`">
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'Artwork',
  created () {
    this.spotifyUser = this.$route.params.spotifyUser
    this.imageId = this.$route.params.imageId
  }
}
</script>
