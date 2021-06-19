<template>
<q-page class='background'>
  <q-page class="bg-white constrain-more q-pa-md">
    <div class="row justify-center camera-frame q-pa-sm">
      <video
      v-show = "!imageCaptured"
      ref="video"
      class='full-width'
      autoplay
      playsinline
      />
      <canvas
      v-show = "imageCaptured"
      ref='canvas'
      class='full-width full-height'
      />
    </div>
    <div class="row justify-center q-ma-md">
      <q-btn
      v-if = 'hasCameraSupport'
      @click='captureImage'
      round
      color="grey-10"
      icon="eva-camera"
      size="lg"
      />
      <q-file
      v-if="!hasCameraSupport"
      outlined
      v-model="imageUpload"
      @input="captureImageFallback"
      clearable
      label="Upload an image!"
      accept="image/*"
      >
      <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
      </template>
      </q-file>
    </div>
    <div class='row justify-center'>
      <q-rating
        v-model="review.rating"
        max="5"
        size="3em"
        color="pink-6"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
      />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input rounded counter outlined v-model="review.caption" :rules="[val => val.length <= 180 || 'Maximum 180 characters!']"
        class='clearable text-pink-6 full-height' clearable type="textarea" placeholder="Enter Caption Here!">
        <template v-slot:append/>
        </q-input>
      </div>
      <div class="row justify-center q-ma-md">
          <q-select
          @filter="filterFn"
          use-input
          :display-value="review.restaurant"
          v-model="review.restaurant"
          :options="options"
          label="Which restaurant would you like to review!"
          />
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn
        unelevated
        rounded color="pink-6"
        label="Submit post"
        @click="confirm = true"/>
      </div>
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Confirm submission?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="Cancel" color="pink-6" v-close-popup/>
          <q-btn flat label="Confirm" color="pink-6" v-close-popup @click="addReview()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  </q-page>
</template>

<script>
import { uid } from 'quasar';
require('md-gum-polyfill');
import restaurants from '../restaurant_data/restaurantTitles.json'
import firebase from 'firebase/app'
import fulldata from '../restaurant_data/full_restaurants.json'
import t2i from '../restaurant_data/title2index.json'
import c2i from '../restaurant_data/cuisine2index.json'
import a2i from '../restaurant_data/ambience2index.json'

export default {
  name: 'camera',
  data() {
    return {
      review: {
        caption: '',
        restaurant: '',
        photo: '',
        date: Date.now(),
        rating: 0,
        userId: '',
        user: '',
      },
      options: restaurants,
      user: this.$fb.auth().currentUser,
      imageCaptured: false,
      hasCameraSupport: true,
      imageUpload: [],
      locationLoading: false,
      data: fulldata['data'],
      confirm: false
    };
  },
  methods: {
    initCamera() {
      navigator.mediaDevices.getUserMedia({
        video: true,
      }).then((stream) => {
        this.$refs.video.srcObject = stream;
      }).catch(() => {
        this.hasCameraSupport = false;
      });
    },
    captureImage() {
      const { video } = this.$refs;
      const { canvas } = this.$refs;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      canvas.toBlob((blob) => {
        this.review.photo = blob
      });
      this.disableCamera();
    },
    captureImageFallback(file) {
      this.review.photo = file;
      const { canvas } = this.$refs;
      const context = canvas.getContext('2d');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },
    addReview() {
      this.$q.loading.show()
      const tempid = uid()
      const bucket = this.$fb.storage().ref().child(tempid)
      const temp = this.$fb.firestore().collection('reviews').doc()
      const curr = this.review
      temp.set({
        caption: curr.caption,
        photo: tempid,
        date: curr.date,
        userId: this.user.uid,
        user: this.user.displayName,
        restaurant: curr.restaurant,
        rating: curr.rating
      }).then((res) => {
        bucket.put(curr.photo).then((res) => {
          this.$fb.storage().ref(tempid).getDownloadURL().then((url) => {
            temp.set({
              photo: url
            }, {merge:true}).then((res) => {
              this.updateUser(temp.id);
              this.updateRestaurant(temp.id);
            })
          })
        })
        alert('Review successfully created!')
      }).catch((error) => {
        this.$q.notify(error.message)
      })
      this.$q.loading.hide()
    },
    filterFn(val, update) {
      if (val === '') {
        update(() => {
          this.options = restaurants
        })
      }
      update(() => {
        const needle = val.toLowerCase();
        this.options = restaurants.filter(
          (v) => v.toLowerCase().startsWith(needle)
        );
      });
    },
    async updateUser(reviewId) {
      let temp;
      await this.$fb.firestore().collection('users').doc(this.user.uid).get().then((snapshot) => {
        temp = snapshot.data()
      })
      const tempC = temp.cuisinecount;
      const tempA = temp.ambiencecount;
      const bookmarks = temp.bookmarks;
      let pot = ''
      if (bookmarks != undefined && bookmarks.includes(this.review.restaurant)) {
        pot = this.review.restaurant;
      }
      console.log(pot)
      const cuisines = this.data[t2i[this.review.restaurant]]['Cuisine'].split(',')
      const ambience = this.data[t2i[this.review.restaurant]]['Good For'].split(',')
      for (let i=0; i < cuisines.length; i++) {
        tempC[c2i[cuisines[i].trim()]] += this.review.rating >= 3 ? this.review.rating - 2 : this.review.rating - 3
      }
      for (let i=0; i < ambience.length; i++) {
        tempA[a2i[ambience[i].trim()]] += this.review.rating >= 3 ? this.review.rating - 2 : this.review.rating - 3
      }
      await this.$fb.firestore().collection('users').doc(this.$fb.auth().currentUser.uid).update({
        reviews: firebase.firestore.FieldValue.arrayUnion(reviewId),
        cuisinecount: tempC,
        ambiencecount: tempA,
        bookmarks: firebase.firestore.FieldValue.arrayRemove(pot)
      }).then((res) => {
        console.log('success')
      });
    },
    async updateRestaurant(reviewId) {
      await this.$fb.firestore().collection('restaurants').where("title", "==", this.review.restaurant).get().then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({
             reviewCount: firebase.firestore.FieldValue.increment(1),
            totalRating: firebase.firestore.FieldValue.increment(this.review.rating),
            reviews: firebase.firestore.FieldValue.arrayUnion(reviewId)
          })
          })
        })
    },
    grabTitleIfProvided() {
      let temp = window.location.hash;
      temp = temp.replace('#/createReview', '')
      const urlParams = new URLSearchParams(temp);
      const title = urlParams.get('title');
      if (title) {
        this.review.restaurant = title
      }
    }
  },
  mounted() {
    this.initCamera();
    this.grabTitleIfProvided();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  },
};
</script>

<style lang="scss">
  .camera-frame
    {
      border: 2px solid $grey-10;
      border-radius: 10px;
      height: 400px;
      width: 400px;
      margin-left:auto;
      margin-right:auto
    }
  .q-field
    {
      width: 600px;
      resize: none;
    }
  .background
    {
      background-color: beige;
      background-image: url('../assets/background.png');
      background-size: cover;
    }
</style>
