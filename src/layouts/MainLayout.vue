<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Barz Bot 🤖
        </q-toolbar-title>

        <div> {{ welcomeMessage }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MainLayout',
  computed: {
    ...mapGetters('spotify', ['user']),
    welcomeMessage () {
      if (this.user) {
        console.log(this.user)
        return `Wuz Up,  ${this.user.display_name}!`
      }
      return 'Wuz Up!'
    }
  }
}
</script>
