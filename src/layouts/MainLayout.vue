<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
    class='bg-white text-pink-6'
    bordered
    >
      <q-toolbar class="constrain">
        <q-btn
        flat
        round
        color="primary"
        icon="eva-camera-outline"
        size = "18px"
        to="/camera"
        class="large-screen-only q-mr-sm"
        />
        <q-separator
        class="large-screen-only"
        vertical
        spaced/>
        <q-toolbar-title
        class='text-grand-hotel
        text-bold'>
          Hungry Explorers
        </q-toolbar-title>
        <q-btn
        flat
        round
        color="primary"
        icon="eva-home-outline"
        size = "18px"
        to="/feed"
        class="large-screen-only"
        />
        <q-btn
        flat
        round
        color="primary"
        icon="eva-log-out-outline"
        size = "18px"
        class="large-screen-only"
        @click="handleClickSignOut"
        />
      </q-toolbar>
    </q-header>

    <q-footer
    class="bg-white small-screen-only"
    bordered>
      <q-tabs
      class='text-pink-6 row justify'
      align='justify'
      active-color="blue-4"
      >
        <q-route-tab
        to='/'
        name="HOME"
        icon="ti-home"
        label="HOME"
        class='col'
        />
        <q-route-tab
        to='/search'
        name="SEARCH"
        icon="las la-hamburger"
        label="SEARCH"
        class='col'
        />
        <q-route-tab
        to='/camera'
        name="CAMERA"
        icon="eva-camera-outline"
        label="CAMERA"
        class='col'
        />
        <q-route-tab
        to='/feed'
        name="FEED"
        icon="las la-hamburger"
        label="FEED"
        class='col'
        />
        <q-route-tab
        to='/profile'
        name="PROFILE"
        icon="ti-id-badge"
        label="PROFILE"
        class='col'
        />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import googleProvider from '../googleProvider.js'
import firebase from 'firebase'

export default {
  name: 'MainLayout',
  data() {
    return {
      user: ''
    };
  },
  methods: {
    async handleClickSignOut() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/login')
      }).catch((error) => {

      })
    }
  },
  beforeMount() {
    const temp = firebase.auth().currentUser
    if (temp) {
    }
    else {
      this.$router.push('/login')
    }
  },
};
</script>

<style lang=scss>
  .q-toolbar
    {
      @media (min-width: $breakpoint-sm-min)
        { height: 77px }
    }
  .q-toolbar__title
    {
      font-size: 35px;
      @media (max-width: $breakpoint-xs-max)
      {
        text-align: center
      }
    }
  .q-footer
    .q-tab__icon
      {font-size: 35px}
</style>
