<template>
  <q-card-section>
    <div
      class="row justify-center items-center content-center q-pa-xs bg-brand-4"
      style="border-top-left-radius: 10px; border-top-right-radius: 10px;"
    >
      <q-item class="fit" >
        <q-item-section avatar>
          <q-btn round type="a" :href="userLink">
            <q-avatar color="dark" round size="64px">
              <img v-if="userImage" :src="userImage">
              <q-icon v-else name="person" color="brand-7" />
            </q-avatar>
          </q-btn>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-h6 text-white">
            <q-badge align="middle" color="brand-7" class="text-dark"> {{ userSubcription }} </q-badge>
            <br>
            {{ userName }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label caption class="text-white">Followers: {{ userFollowers }}</q-item-label>
          <q-item-label caption class="text-white">Country: {{ userCountry }}</q-item-label>
        </q-item-section>

      </q-item>
    </div>
  </q-card-section>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'User',
  computed: {
    ...mapGetters('spotify', ['user']),
    userName () {
      if (this.user) {
        return this.user.display_name
      } else {
        return null
      }
    },
    userLink () {
      if (this.user) {
        return this.user.external_urls.spotify
      } else {
        return null
      }
    },
    userImage () {
      if (this.user) {
        return this.user.images[0].url
      } else {
        return null
      }
    },
    userSubcription () {
      if (this.user) {
        return this.user.product
      } else {
        return null
      }
    },
    userEmail () {
      if (this.user) {
        return this.user.email
      } else {
        return null
      }
    },
    userFollowers () {
      if (this.user) {
        return this.user.followers.total
      } else {
        return null
      }
    },
    userCountry () {
      if (this.user) {
        return this.user.country
      } else {
        return null
      }
    }
  }
}
</script>
