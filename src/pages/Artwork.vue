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
  created () {
    this.spotifyUser = this.$route.params.spotifyUser
    this.imageId = this.$route.params.imageId
  }
}
</script>
