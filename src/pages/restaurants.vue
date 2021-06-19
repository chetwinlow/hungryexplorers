<template>
<q-page class='background1'>
  <q-page class="bg-white constrain-more q-pa-md">
     <q-input v-model="searchTerm" filled type="search" class="q-pb-none full-width" @input="filter(searchTerm)" label="Start searching!">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-scroll-area
      v-if="searchTerm.length && !searchResults.length"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 500px"
      >
      <q-list bordered v-if="searchTerm.length && !searchResults.length">
        <q-item-label header v-if="filteredCuisines.length < 1000" class="text-pink-6 text-h6">Cuisine</q-item-label>
        <q-separator bold spaced v-if="filteredCuisines.length"/>
        <q-item v-for="cuisine in filteredCuisines" :key="cuisine"class="q-my-none q-py-none text-left" clickable v-ripple @click='finaliseCuisine(cuisine)'>
        <q-item-section>
          <q-item-label>{{ cuisine }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator bold spaced v-if="filteredCuisines.length"/>
        <q-item-label header v-if="filteredLocations.length" class="text-pink-6 text-h6">Location</q-item-label>
        <q-separator bold spaced v-if="filteredLocations.length"/>
        <q-item v-for="location in filteredLocations" :key="location"class="q-my-sm text-left" clickable v-ripple  @click='finaliseLocation(location)'>
        <q-item-section>
          <q-item-label>{{ location }}</q-item-label>
        </q-item-section>
      </q-item>
        <q-separator bold spaced v-if="filteredLocations.length"/>
        <q-item-label header v-if="filteredRestaurants.length" class="text-pink-6 text-h6">Restaurants</q-item-label>
        <q-separator bold spaced v-if="filteredRestaurants.length"/>
        <q-item v-for="restaurant in filteredRestaurants" :key="restaurant"class="q-my-sm text-left" clickable v-ripple  @click='finaliseRestaurant(restaurant)'>
        <q-item-section>
          <q-item-label>{{ restaurant }}</q-item-label>
        </q-item-section>
      </q-item>
      </q-list>
      </q-scroll-area>

    <template v-if="!loadingRestaurants && searchResults.length" class='q-pa-md scrollArea'>
      <q-infinite-scroll @load="onLoad" :offset="250">
          <q-card
          v-for="(restaurant,index) in displayedResults"
          :key="index"
          class="card-restaurant q-mb-md full-width"
          flat
          >
          <q-card-section horizontal class='full-height'>
          <q-img
            class="col-4 full-height rounded-borders"
            :src="restaurant.images[0]"
            />
            <q-separator class='blah' color="white" vertical/>
            <q-card-section vertical class='full-width full-height'>
              <q-btn @click='gotoresto(restaurant.title)' flat class='clickabletitle'>
              <q-card-section class='text-h6 q-pa-none'>
                  {{restaurant.title}}
              </q-card-section>
              </q-btn>
              <q-card-section class='text-subtitle1 q-pa-none'>{{restaurant.Location}} | {{restaurant.Price }} | {{restaurant.Cuisine}}</q-card-section>
              <q-card-section class='text-subtitle1 q-pa-none'> {{`${restaurant.reviews} reviews`}}</q-card-section>
            </q-card-section>
            </q-card-section>
          </q-card>
          <template v-slot:loading v-show="!this.noMoreResults">
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
      </q-infinite-scroll>
    </template>
  </q-page> 
  </q-page>
</template>
<script>
import restaurantTitles from '../restaurant_data/restaurantTitles.json'
import restaurantLocations from '../restaurant_data/restaurantLocations.json'
import restaurantCuisines from '../restaurant_data/restaurantCuisines.json'
import restaurantdata from '../restaurant_data/full_restaurants.json'

export default {
  name: 'restaurants',
  data() {
    return {
      restaurantTitles,
      restaurantLocations,
      restaurantCuisines,
      fullrestaurantdata: restaurantdata['data'],
      searchResults: [],
      displayedResults: [],
      index: 0,
      filteredLocations: [],
      filteredCuisines: [],
      filteredRestaurants: [],
      loadingRestaurants: false,
      searchTerm: '',
      isSearching: false,
      noMoreResults: false,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  },
  methods: {
    getRestaurants() {
      const restaurants = [];
      this.loadingRestaurants = true
      this.$fb.firestore().collection('restaurants').get().then((snapshot) => {
        snapshot.forEach((doc) => {
          restaurants.push(doc.data())
        })
        this.restaurants = this.restaurants
        this.loadingRestaurants = false
      }).catch((error) => {
          this.$q.dialog({
            title: "Error",
            message: "Could not load restaurants"
          })
        this.loadingRestaurants = false
      })  
    },
    getlink(title) {
      return `restaurants/${title}`
    },
    gotoresto(title) {
      this.$router.push(`restaurants/${title}`)
    },
    filterLocation(value) {
      if (value === '') {
        this.filteredLocations = []
      } else if (this.filteredLocations.length > 0) {
        this.filteredLocations = this.filteredLocations.filter(x => {
          return x.toLowerCase().includes(value.toLowerCase())
        })
      } else {
          this.filteredLocations = this.restaurantLocations.filter(x => {
          return x.toLowerCase().includes(value.toLowerCase())
        })
      }
    },
    filterCuisine(value) {
      if (value === '') {
        this.filteredCuisines = []
        this.searchResults = []
        this.displayedResults = []
      } else if (this.filteredCuisines.length > 0) {
        this.filteredCuisines = this.filteredCuisines.filter(x => {
          return x.toLowerCase().includes(value.toLowerCase())
        })
      } else {
          this.filteredCuisines = this.restaurantCuisines.filter(x => {
          return x.toLowerCase().includes(value.toLowerCase())
        })
      }
    },
    filterRestaurant(value) {
      if (value === '') {
        this.filteredRestaurants = []
      } else if (this.filteredRestaurants.length > 0) {
        this.filteredRestaurants = this.filteredRestaurants.filter(x => {
          return x.toLowerCase().includes(value.toLowerCase())
        })
      } else {
          this.filteredRestaurants = this.restaurantTitles.filter(x => {
          return x.toLowerCase().includes(value.toLowerCase())
        })
      }
    },
    filter(value){
      this.filterLocation(value)
      this.filterCuisine(value)
      this.filterRestaurant(value)
    },
    finaliseCuisine(cuisine) {
      this.loadingRestaurant = true
      this.displayedResults = []
      this.searchTerm = cuisine
      this.searchResults = this.fullrestaurantdata.filter(x => {
        return x.Cuisine.includes(this.searchTerm)
      })
      this.loadingRestaurant = false
      const temp = this.searchResults.length > 3 ? 4 : this.searchResults.length
      for (let i=0; i < temp; i++) {
        this.displayedResults.push(this.searchResults[i])
        this.index = temp
      }
    },
    finaliseLocation(location) {
      this.loadingRestaurant = true
      this.searchTerm = location
      this.displayedResults = []
      this.searchResults = this.fullrestaurantdata.filter(x => {
        return x.Location.includes(this.searchTerm)
      })
      this.loadingRestaurant = false
      const temp = this.searchResults.length > 3 ? 4 : this.searchResults.length
      for (let i=0; i < temp; i++) {
        this.displayedResults.push(this.searchResults[i])
        this.index = temp
      }
    },
    finaliseRestaurant(restaurant) {
      this.loadingRestaurant = true
      this.searchTerm = restaurant
      this.displayedResults = []
      this.searchResults = this.fullrestaurantdata.filter(x => {
        return x.title.includes(this.searchTerm)
      })
      this.loadingRestaurant = false
      const temp = this.searchResults.length > 3 ? 4 : this.searchResults.length
      for (let i=0; i < temp; i++) {
        this.displayedResults.push(this.searchResults[i])
        this.index = temp
      }
    },
    onLoad(index, done) {
      if (this.index < this.searchResults.length) {
        setTimeout(() => {
          if (this.displayedResults) {
            const temp = this.index + 3 <= this.searchResults.length  ? this.index+4 : this.searchResults.length
            for (let i=this.index; i < temp; i++) {
              this.displayedResults.push(this.searchResults[i])
            }
            this.index += temp
            done()
          }
        }, 2000)
      } else {
        this.noMoreResults = true
      }
    }
  },
  created(){
  //  this.getRestaurants()
  }
};
</script>
<style lang="scss">
  .card-restaurant
    {
      height: 150px
    }
    .q-img
    {
      object-fit: contain
    }
  .blah
  {
    margin-left: 15px;
    margin-right: 15px;
  }
  .clickabletitle
  {
    left: -16px;
  }
  .background1
    {
      background-color: beige;
      background-image: url('../assets/background.png');
      background-size: cover;
      background-attachment: fixed
    }
  .scrollArea
  {
    height: 300px;
    max-height: 500px;
  }
</style>