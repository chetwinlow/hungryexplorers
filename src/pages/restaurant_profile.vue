<template>
  <q-page class="background">
    <q-page class="bg-white constrain-more q-pa-none row justify-center items-center">
      <q-card square class="shadow-1 full-width" style="border: 2px solid pink">
        <q-card-section>
          <div class="text-h4 text-pink-6 row ">
            <div class="col-10"> {{this.title}} </div>
            <div  class="column col-2 q-pt-xs" >
            <q-btn class='col q-mb-sm text-caption'push color="pink" @click="goToReview">
              review now
            </q-btn>
            <q-btn class="col text-caption" push color="pink" @click="bookmark">
              Bookmark this
            </q-btn>
            </div>
          </div>
          <div class="q-pb-lg">
            <q-rating
            v-model="this.rating"
            max="5"
            size="35px"
            color="pink-6"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            class="q-pl-md"
            style="margin-left: -18px;"
            disable
            />
          </div>
          <div class="full-width">
            <q-carousel
            animated
            v-model="slide"
            navigation
            infinite
            :autoplay="2000"
            arrows
            transition-prev="slide-right"
            transition-next="slide-left"
            @mouseenter="autoplay = false"
            @mouseleave="autoplay = true"
          >
          <q-carousel-slide v-for="(image,index) in this.restaurantdoc.images" :key="index" :name="index" :img-src="image" />
          </q-carousel>
          </div>
        </q-card-section>
        <q-separator spaced inset color="pink" size="5px"/>
        <q-card-section>
          <div class="row">
          <q-card v-for="(v,k) in this.grid" :key="k" v-if="v!=undefined && v.length > 0" class="q-pa-md col-6" flat>
            <div class="text-h5 text-pink-6" style="text-transform: uppercase">{{k}}</div>
            <div>{{v}}</div>
          </q-card>
          <q-card class="q-pa-md col-6" flat>
            <div class="text-h5 text-pink-6" style="text-transform: uppercase">address</div>
            <div>{{this.address}}</div>
            <q-btn push @click="goToMaps" v-show="this.addresslink.length>0">
              <q-icon name="img:https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg"/>
            </q-btn>
          </q-card>
          </div>
        </q-card-section>
         <q-separator spaced inset color="pink" size="5px"/>
         <q-card-section>
         <div class="column">
           <q-card v-for="(v,k) in this.tb" :key="k" v-if="v!=undefined && v.length > 0" class="q-pa-md" flat>
             <div class="text-h5 text-pink-6" style="text-transform: uppercase">{{k}}</div>
             <div>{{v}}</div>
           </q-card>
         </div>
         </q-card-section>
      </q-card>
    </q-page>
  </q-page>
</template>

<script>
import firebase from 'firebase/app'

export default {
    name: 'profilepage',
    data() {
      return {
          restaurantdoc: {},
          title:'',
          about: '',
          cuisine: '',
          ambience: '',
          address: '',
          addresslink: '',
          rating: 0,
          pressrelease: '',
          dwl: '',
          pricerange: '',
          location: '',
          menus: [],
          hours: '',
          grid: {},
          tb: {},
          autoplay: true,
          slide: 0,
          restUid: ''
      }
    },
    methods: {
        async getCurr() {
            await this.$fb.firestore().collection('restaurants').where("title", "==", this.$router.currentRoute.params.id).get().then((snapshot) => {
              snapshot.forEach((doc) => {
                this.restUid = doc.id
                this.restaurantdoc = doc.data()
              })
            })
            console.log(this.restaurantdoc)
        },
        formatInfo() {
          this.title = this.restaurantdoc['title']
          this.about = this.restaurantdoc['ABOUT']
          this.cuisine = this.restaurantdoc['Cuisine']
          this.ambience = this.restaurantdoc["Good For"]
          this.address = this.restaurantdoc['Address']
          this.addresslink = this.restaurantdoc['Address Link']
          this.rating = this.restaurantdoc['totalRating'] / this.restaurantdoc['reviewCount']
          this.pressrelease = this.restaurantdoc['PRESS RELEASE']
          this.dwl = this.restaurantdoc['DISHES WE LOVE']
          this.pricerange = this.restaurantdoc['Price']
          this.location = this.restaurantdoc['Location']
          this.menus = this.restaurantdoc['Menus']
          this.hours = this.restaurantdoc['Hours']
        },
        formatGrid() {
          this.grid = {
            cuisine: this.cuisine,
            ambience: this.ambience,
            pricerange: this.pricerange,
            location: this.location,
            hours:this.hours
          }
        },
        formatTextBlock() {
          this.tb = {
            about: this.about,
            "dishes we love": this.dwl,
            "press release": this.pressrelease
          }
        },
        goToMaps() {
          window.open(this.addresslink, '_blank')
        },
        goToReview() {
          this.$router.push({path:'/createReview', query: {title: this.title}})
        },
        async bookmark() {
          await this.$fb.firestore().collection('users').doc(this.$fb.auth().currentUser.uid).update({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(this.title)
          }).then((res) => {
            this.$q.notify("Successfully bookmarked!")
          }).catch((error) => {
            this.$q.notify("Oh no something went wrong")
          })
        }
    },
    async created() {
        await this.getCurr()
        this.formatInfo()
        this.formatGrid()
        this.formatTextBlock()
    }
};
</script>
