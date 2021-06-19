<template>
  <q-page class='background'>
    <q-page class="bg-white constrain-more">
      <q-icon name="eva-settings-outline" color="pink-6" size="35px" style="position:absolute; padding: 50px; right: 0px; top: 0px"/>
      <div class="row justify-center q-pa-xl">
        <q-avatar size="250px">
          <img style="border: 8px solid pink" src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80"/>
        </q-avatar>
        <q-card class="full-width full-height" flat style="height: 200px; margin-top: 20px">
          <q-card-section class="text-center justify-center">
            <div class="text-h2">{{this.user.username}}</div>
            <div class="q-pa-md text-h6">reviewed {{this.numReviews}} restaurants</div>
         </q-card-section>
             <q-separator spaced inset color="pink"/>
              <q-tabs
                v-model="selection"
                indicator-color="transparent"
                active-color="pink"
                class="bg-white text-grey-5"
                flat
              >
                <q-tab name="particulars" icon="mail" label="Particulars" @click="gotoParticulars"/>
                <q-tab name="reviews" icon="alarm" label="Reviews" @click="gotoReviews"/>
                <q-tab name="bookmarks" icon="bookmark" label="Bookmarks" @click="gotoBookmarks">
                  <q-badge color="red" floating>{{this.bookmarks.length}}</q-badge>
                </q-tab>
              </q-tabs>
          <q-card-section v-if="this.selection == 'particulars'">
          <q-card-section class="q-pa-none">
            <div class="row justify-center q-pa-sm">
              <div class="text-subtitle-1" style="position: absolute; left:20px">Bio:</div>
            <q-input rounded counter outlined v-model="bio" :rules="[val => val.length <= 180 || 'Maximum 180 characters!']"
            class='clearable text-pink-6 q-pt-lg' clearable type="textarea" placeholder="Tell the world about yourself!"
            :disable="!this.ernestEditorialRights || !this.isEditing">
            <template v-slot:append/>
            </q-input>
            </div>
            <q-icon v-show="this.ernestEditorialRights && !this.isEditing" style="position:absolute; right:10px; bottom:40px" size="25px" name='eva-edit' @click="editBio"/>
            <q-icon v-show="this.ernestEditorialRights && this.isEditing" style="position:absolute; right:10px; bottom:40px" size="25px" name='eva-save' clickable @click="saveBio"/>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle-1" style="position: absolute; left:20px">Cuisine Preferences:</div>
            <div class="text-center q-pt-lg">{{this.cPref}}</div>
            <q-icon style="position:absolute; right:10px; bottom:20px" size="25px" name='eva-edit'/>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle-1" style="position: absolute; left:20px">Ambience Preferences:</div>
            <div class="text-center q-pt-lg">{{this.aPref}}</div>
            <q-icon style="position:absolute; right:10px; bottom:20px" size="25px" name='eva-edit'/>
          </q-card-section>
          </q-card-section>
          <q-card-section v-if="this.selection == 'reviews'" class="row justify-center">
          <q-img
          v-for="review in reviews"
          :key="review.photo"
          :src="review.photo"
          clickable
          ripple
          @click="print"
          class="col-4 q-ma-sm justify-left"
          style="border: 5px solid pink; border-radius: 20px; height: 200px; width: 200px;"
          />
          </q-card-section>
          <q-card-section class="row" v-if="this.selection == 'bookmarks'">
            <q-card class="column col-6" style="height: 236px;" square v-for="bookmark in this.bookmarks" :key="bookmark.title" @click="pending(bookmark.title)">
              <img class="col-8" :src="bookmark.images[0]">
              <q-card-section class="col-4 row items-center">
                <div class="text-subtitle1">{{bookmark.title}}</div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
      </div>
          <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Sure you want to review {{this.pendingReview}} now?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="pink-6" v-close-popup/>
          <q-btn flat label="Confirm" color="pink-6" v-close-popup @click="reviewNow()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
      </q-page>
    </q-page>
</template>

<script>
import fullrestaurantdata from '../restaurant_data/full_restaurants.json'

export default {
  name: 'profilepage',
  data() {
    return {
      user: {},
      bio: '',
      ernestEditorialRights: false,
      isEditing: false,
      reviews: [],
      numReviews: 0,
      aPref: '',
      cPref: '',
      selection: 'particulars',
      data: fullrestaurantdata['data'],
      bookmarks: [],
      confirm: false,
      pendingReview: ''
    }
  },
  methods: {
    async getCurr() {
      await this.$fb.firestore().collection('users').doc(this.$router.currentRoute.params.id).get().then((doc) => {
          this.user = doc.data()
      }).catch((error) => {
        console.log(error.message)
        this.$q.notify('USER DOES NOT EXIST!!!')
      })
      this.bio = this.user.bio
    },
    print() { //for the image clicking
      console.log('clicky')
    },
    editBio() {
      this.isEditing = true;
      console.log(this.isEditing)
    },
    async saveBio() {
      await this.$fb.firestore().collection('users').doc(this.$fb.auth().currentUser.uid).update({
        bio: this.bio
      }).then((res) => {
        this.$q.notify('Bio successfully changed!')
      }).catch((error) => {
        this.$q.notify('Something went wrong :(')
      })
      this.isEditing = false;
    },
    async getReviews() {
      await this.$fb.firestore().collection('reviews').where("userId", "==", this.$router.currentRoute.params.id).get().then((snapshot) => {
        snapshot.forEach((doc) => {
          this.reviews.push(doc.data())
        })
      })
      this.numReviews = this.reviews.length
    },
    fixAC() {
     this.aPref = this.user.ambiencePreferences.join(', ')
     this.cPref = this.user.cuisinePreferences.join(', ')
    },
    gotoReviews() {
      this.selection = 'reviews'
    },
    gotoParticulars() {
      this.selection = 'particulars'
    },
    gotoBookmarks() {
      this.selection = 'bookmarks'
    },
    grabBookmarks() {
      this.bookmarks = this.data.filter(x => {
        return  this.user.bookmarks.includes(x.title)
      })
    },
    pending(title){
      this.confirm = true;
      this.pendingReview = title;
    },
    reviewNow() {
      this.$router.push({path:'/createReview', query: {title: this.pendingReview}})
    }
},
async created() {
    if (this.$fb.auth().currentUser.uid === this.$router.currentRoute.params.id) {
      this.ernestEditorialRights = true
    }
    await this.getCurr()
    this.getReviews()
    this.fixAC()
    this.grabBookmarks()
  }
};
</script>

<style lang="scss">
  .background
    {
      background-color: beige;
      background-image: url('../assets/background.png');
      background-size: cover;
      background-attachment: fixed;
    }
</style>
