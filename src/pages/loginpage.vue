<template>
  <q-page class="background window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square class="shadow-1 border-pink">
        <q-card-section>
            <div
            class="text-h4 row justify-center text-grand-hotel text-bold text-pink-6">
            Hungry Explorers  
            </div>
        </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled squared clearable class="info-form" v-model="email" type="email" label="Email" />
              <q-input filled squared clearable class="info-form" v-model="password" type="password" label="Password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="pink-6" class="login-button" label="Login" @click='signIn'/>
          </q-card-actions>
          <hr class="login-line">
          <q-card-section class="text-center q-pa-none text-red-6 google-button">
            <q-btn @click="googleSignIn" icon='eva-google'/>
          </q-card-section>
          <q-card-section>
            <div class="q-pt-xl text-subtitle-1 row justify-center text-pink-6">
              Don't have an account? <router-link to="/register">Sign up</router-link>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import {Notify} from 'quasar'

export default {
  name: 'loginpage',
  data () {
    return {
        email: '',
        password: '',
    }
  },
  methods: {
    async signIn() {
      await this.$fb.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.$router.push('/feed')
        })
        .catch((error) => {
          this.$q.notify('Login Failed! :(')
        })
    },
    async googleSignIn(){
      await this.$fb.auth()
          .signInWithPopup(this.$googleProvider)
          .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            // The signed-in user info.
            const user = result.user;
            const temp = this.$fb.firestore().collection('users').doc(user.uid)
            if (!temp.get().exists) {
            temp.set({
              fullname: this.fullname,
              email: this.email,
              username: this.username,
              isNew: true,
              reviews: [],
              cuisinePreferences: [],
              ambiencePreferences: [],
              cuisinecount: Array(49).fill(0),
              ambiencecount: Array(12).fill(0)
            },{ merge: true })
            this.$router.push('/newUserSetup')
          } else {
            this.$router.push('/feed')
          }            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
            // ...
          });
    },
  },
  beforeMount() {
    const user = this.$fb.auth().currentUser
    if (user) {
      this.$router.push('/feed')
    }
  }
} 
</script>
<style>
.background{
  background-color: beige;
  background-image: url('../assets/background.png');
  background-size: cover;
}
.border-pink{
  border: 5px solid #e91e63;
  height: 450px;
  width: 300px;
}
.login-button{
  text-align: center;
  margin: auto;
  width: 50%;
  border-radius: 20px;
  position: relative;
  top: 10px;
}
.login-line{
  height: 1px;
  border: none;
  color: #e91e63;
  background-color: #e91e63;
  width: 80%;
  position: relative;
  top: 10px;
}
.info-form{
  height: 20px;
  display: block;
  margin: auto;
  text-align: center;
  padding: 30px 40px;
}
.google-button{
  position: relative;
  top: 20px;
}
</style>