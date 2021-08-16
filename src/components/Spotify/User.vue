<template>
  <q-card class="q-ma-none q-pa-none">
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row justify-center items-center content-center bg-brand-4">
        <q-item class="fit" >
          <q-item-section avatar>
            <q-btn round type="a" :href="accountLink">
              <q-avatar color="dark" round size="64px">
                <q-img v-if="profileImage" :src="profileImage"/>
                <q-icon v-else name="person" color="brand-7" />
              </q-avatar>
            </q-btn>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h6 text-white">
              <q-badge align="middle" color="brand-7" class="text-dark"> {{ subscription }} </q-badge>
              <br>
              {{ username }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'User',
  computed: {
    ...mapGetters('spotify', ['user']),
    username () {
      if (this.user) {
        return this.user.display_name
      } else {
        return 'Username'
      }
    },
    accountLink () {
      if (this.user) {
        return this.user.external_urls.spotify
      } else {
        return 'https://www.spotify.com'
      }
    },
    profileImage () {
      if (this.user) {
        return this.user.images[0].url
      } else {
        return null
      }
    },
    subscription () {
      if (this.user) {
        return this.user.product
      } else {
        return 'Subscription'
      }
    }
  }
}
</script>
