<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-brand-5" elevated>
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
        return `Welcome ${this.user.display_name}!`
      }
      return 'Welcome'
    }
  }
}
</script>
