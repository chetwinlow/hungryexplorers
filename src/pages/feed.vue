<template>
<q-page class="background">
  <q-page class=" bg-white constrain-more q-pa-md">
    <div class='row q-col-gutter-lg'>
      <div class="col-2"></div>
      <div class='col-8'>
        <template v-if="!loadingReviews && reviews.length">
        <q-card
        v-for="review in reviews"
        :key="review.id"
        class="card-review q-mb-md full-width"
        flat
        >
             <q-card-section class="text-center q-pa-sm">
               <q-img style="border-radius:25px;" :src="review.photo" /> 
             </q-card-section>
            <q-card-section class="column q-pa-sm">
              <q-item class='q-pa-none'>
          <q-item-section side class="q-pa-none q-pr-sm">
            <q-avatar size="25px">
              <img src="https://s.gravatar.com/avatar/ce7f3697e231df38b3ca6065848520da?s=80">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold text-h6">{{review.user}}</q-item-label>
          </q-item-section>
          <q-item-section side>
          <q-icon name="eva-message-square-outline" size="20px" color="pink" class='q-pr-md'/>
          </q-item-section>
        </q-item>
              <div class="row" caption> 
              <q-icon name="eva-pin-outline" size="20px" color="pink"/>
              <q-separator vertical color="white" spaced/>
                {{review.restaurant}}
              </div>
            </q-card-section>
          <q-separator spaced color="pink-6" size="3px" inset/>
          <q-card-section class="text-center">
            <div style='word-wrap: break-word'>{{review.caption}}</div>
            <div class="text-caption text-grey">{{review.date | niceDate}}</div>
          </q-card-section>
        </q-card>
        </template>
        <template v-else-if="!loadingReviews && !reviews.length">
          <h5 class='text-center text-grey'> No reviews yet </h5>
        </template>
        <template v-else>
           <q-card flat bordered >
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" size="40px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>
      </div>
    </div>
  </q-page>
</q-page>
</template>

<script>  

import {date} from 'quasar'

export default {


  name: 'feedpage',
  data() {
    return {
      reviews: [],
      loadingReviews: false,
      hello: ''
    }
  },
  methods: {
    getReviews() {  
      const reviews = []
      this.loadingReviews = true
      this.$fb.firestore().collection('reviews').orderBy('date', 'desc').get().then(snapshot => {
        snapshot.forEach((doc) => {
          reviews.push(doc.data())
        });
        this.reviews = reviews
        this.loadingReviews = false
      }).catch((error) => {
          this.$q.dialog({
            title: "Error",
            message: "Could not load reviews"
          })
        this.loadingReviews = false
      })  
    }
  },

  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMMM D h:mmA');
    },
  },
  created() {
    this.getReviews()
  }
};
</script>

<style lang="scss">
  .card-review
    {
      height:500px;
      border: 5px solid deeppink
    }
    .q-img
      {
        height: 250px;
        width:250px;
        border: 2px solid black
      }
  .background
    {
      background-color: beige;
      background-image: url('../assets/background.png');
      background-size: cover;
      background-attachment: fixed
    }
</style>
