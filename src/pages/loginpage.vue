<template>
  <q-page class="bg-pink-6 window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
        <q-card-section>
            <div
            class="text-h4 row justify-center text-grand-hotel text-bold text-pink-6">
            Hungry Explorers
            </div>
        </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="email" />
              <q-input square filled clearable v-model="password" type="password" label="password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="pink-6" size="lg" class="full-width" label="Login" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none text-red-6">
            <q-btn @click="handleClickSignIn" :disabled="!isInit" icon='eva-google'/>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>

export default {
  name: 'loginpage',
  data () {
    return {
        email: '',
        password: '',
        isInit: false,
        isSignIn: false
    }
  },

  methods: {
     async handleClickSignIn(){
      try {
        const googleUser = await this.$gAuth.signIn()
        //this.$axios.post(`${process.env.API}/users`, googleUser)
        this.isSignIn = this.$gAuth.isAuthorized
        this.$q.localStorage.set('isSignIn', true)
        this.$q.localStorage.set('email', googleUser.At.ku)
        this.$router.push('/feed')
      } catch (error) {
        // On fail do something
        console.error(error);
        return null;
      }
    },
  },
  beforeCreate() {
      if (this.$q.localStorage.getItem('isSignIn')) this.$router.push('/feed')
  },
  mounted(){
    let that = this
    let checkGauthLoad = setInterval(function(){
      that.isInit = that.$gAuth.isInit
      that.isSignIn = that.$gAuth.isAuthorized
      if(that.isInit) clearInterval(checkGauthLoad)
    }, 1000);
  }
  
}
</script>
<style>

</style>