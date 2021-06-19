<template>

  <q-page class="bg-pink-6 window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row-7 q-gutter-md">
        <q-card square bordered class="q-pa-lg shadow-1">
        <q-card-section>
            <div
            class="text-h4 row  text-grand-hotel text-bold text-pink-6">
            Hungry Explorers
            </div>
        </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="Email" />
              <q-input square filled clearable v-model="fullname" type="fullname" label="Full Name" />
              <q-input square filled clearable v-model="username" type="username" label="Username" />
              <q-input square filled clearable v-model="password" type="password" label="Password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="pink-6" size="lg" class="full-width" label="Sign up" @click='register'/>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
    data() {
       return {
            email: '',
            password: '',
            fullname: '',
            username: ''
       }
    },
    methods: {
        async register() {
            await this.$fb.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then((res) =>  {
                const user = this.$fb.auth().currentUser;
                user.updateProfile({
                displayName: this.username
                })
                const temp = this.$fb.firestore().collection('users').doc(user.uid)
                if (!temp.get().exists) {
                  temp.set({
                    fullname: this.fullname,
                    email: this.email,
                    username: this.username,
                    reviews: [],
                    isNew: true,
                    cuisinePreferences: [],
                    ambiencePreferences: [],
                    cuisinecount: new Array(49).fill(0),
                    ambiencecount: new Array(12).fill(0)
                  },{ merge: true })
                }
            })
            .catch((error) => {
                alert(error.message)
            })
            this.$router.push('/newUserSetup')
        }
    }
}
</script>

<style>

</style>
