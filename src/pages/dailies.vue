<template>
  <q-page class="background">
  <q-page class="row bg-white constrain q-pa-md">
    <div class="column col-2">
      <div class="col-4 row items-center justify-center text-center text-h5 text-pink-6">
        <div>SATISFACTION GUARANTEED</div>
      </div>
      <div class="col-4 row items-center justify-center text-center text-h5 text-pink-6">
        <div>CALL-NSUME ME MAYBE?</div>
      </div>
      <div class="col-4 row items-center justify-center text-center text-h5 text-pink-6">
        <div>TASTE BREAKER</div>
      </div>
    </div>
    <div class="column col-10 justify-center items-center full-height">
      <div class="col-4">
        <q-img v-for="resto in first" :key='resto.title' :src="resto.images[0]" style="height: 200px; width: 200px; margin: 15px; border-radius:20px; border:2px solid deeppink;"
        @click="gotoRestaurant(resto.title)"
        />
        <q-separator inset color="pink" size="5px"/>
      </div>
      <div class="col-4">
        <q-img v-for="resto in second" :key='resto.title' :src="resto.images[0]" style="height: 200px; width: 200px; margin: 15px; border-radius:20px; border:2px solid deeppink;"
        @click="gotoRestaurant(resto.title)"
        />
        <q-separator inset color="pink" size="5px"/>
      </div>
      <div class="col-4">
        <q-img v-for="resto in third" :key='resto.title' :src="resto.images[0]" style="height: 200px; width: 200px; margin: 15px; border-radius:20px; border:2px solid deeppink;"
        @click="gotoRestaurant(resto.title)"
        />
      </div>
    </div>
  </q-page>
  </q-page>
</template>

<script>
import fullrestaurantdata from '../restaurant_data/full_restaurants.json'



export default {
  name: 'homepage',
  data() {
    return {
      data: fullrestaurantdata['data'],
      first: [],
      second: [],
      third: [],
    }
  },
  methods: {
    openPopUp() {
      console.log('hehe')
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    getReccs() {
     const lst = Array(9).fill(0);
     for (let i=0; i < lst.length; i++){
       lst[i] = this.getRandomInt(1499)
     }
     for (let i=0; i < 3; i++) {
       this.first.push(this.data[lst[i]])
       this.second.push(this.data[lst[i+3]])
       this.third.push(this.data[lst[i+6]])
     }
    },
    gotoRestaurant(title){
      this.$router.push(`/restaurants/${title}`)
    }
  },
  created() {
    this.getReccs();
  }
};
</script>

<style lang="scss">
  .background
    {
      background-color: beige;
      background-image: url('../assets/background.png');
      background-size: cover;
      background-attachment: fixed
    }
</style>
