<template>
  <q-layout view="lHh Lpr lFf">
    <q-header 
    class='col header text-pink-6'
    bordered
    >
      <q-toolbar class='row-8'>
          <q-toolbar-title class="text-grand-hotel text-bold">
              Hungry Explorers
          </q-toolbar-title>
          <div class="second">
            <q-btn class='align-left q-pt-md' flat icon-right="eva-calendar-outline" label="Dailies" to='/'/>
            <q-btn class='align-left q-pt-md' flat icon-right="mail" label="My Feed" to='/feed'/>
            <q-btn class='align-left q-pt-md' flat icon-right="eva-camera-outline" label="Post" to='/createReview'/>
            <q-btn class='align-left q-pt-md' flat icon-right="eva-search-outline" label="Search" to='/restaurants'/>
          </div>
        <q-btn flat class = "justify-right" @click="gotoProfile">
        <q-item class="justify-right">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold text-h6">{{this.user.displayName}}</q-item-label>
            <q-item-label caption>
              {{this.user.email}}
            </q-item-label>
          </q-item-section>
        </q-item>
        </q-btn>
        <q-btn flat icon="eva-log-out-outline" size="18px"  @click='handleClickSignOut'/>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import googleProvider from '../googleProvider.js'

export default {
  name: 'MainLayout',
  data() {
    return {
      user: this.$fb.auth().currentUser,
    };
  },
  methods: {
    async handleClickSignOut() {
      this.$fb.auth().signOut().then(() => {
        this.$router.push('/login')
      }).catch((error) => {

      })
    },
    checkIfPP() {
      return window.location.hash.includes('#/profile')
    },
    gotoProfile() {
      const temp = this.checkIfPP();
      if (!temp) {
        this.$router.push(`profile/${this.user.uid}`)
      }
    }
  },
  beforeMount() {
    const temp = this.$fb.auth().currentUser
    if (temp) {
    }
    else {
      this.$router.push('/login')
    }
  },
};
</script>

<style lang=scss>
.second{
  position: relative;
  right: 100px;
}
  .q-toolbar
    {
      background-color: #E4DBDE;
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
