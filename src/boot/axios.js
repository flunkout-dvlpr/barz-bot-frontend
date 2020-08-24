import Vue from 'vue'
import axios from 'axios'

export default function ({ store }) {
  axios.defaults.headers.common.Authorization = `Bearer ${store.state.spotify.token}`
}

Vue.prototype.$axios = axios
