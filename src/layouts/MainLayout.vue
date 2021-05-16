<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
    class='bg-white text-pink-6'
    bordered
    >
      <q-toolbar>
        <q-toolbar-title
        class='text-grand-hotel
        text-center
        text-bold'>
          Hungry Explorers
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer
    class="bg-white small-screen-only"
    bordered>
      <q-tabs
      class='text-pink-6'
      active-color="blue-4">
        <q-route-tab
        to='/'
        name="HOME"
        icon="ti-home"
        label="HOME"
        />
        <q-route-tab
        to='/profile'
        name="PROFILE"
        icon="ti-id-badge"
        label="PROFILE"
        />
        <q-route-tab
        to='/quickstart'
        name="QUICKSTART"
        icon="las la-hamburger"
        label="QUICKSTART"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data() {
    return {
    };
  },
};
</script>

<style lang=scss>
  .q-toolbar__title
    { text-align: center;
      font-size: 35px  }
  .q-footer
    .q-tab__icon
      {font-size: 30px}
</style>
