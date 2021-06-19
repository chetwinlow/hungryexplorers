<template>
    <q-page class="background window-height window-width row justify-center items-center">
        <q-card class="text-pink-6 text-left" style="height:500px; width: 600px" v-show="!isGoTime && !isCuisineDone">
        <q-card-section class="text-left">
            <h3>WELCOME!</h3>
            <div class="q-pb-md">{{welcomeText1}}</div>
            <div class="q-pb-md">{{welcomeText2}}</div>
            <div class="q-pb-md">{{welcomeText3}}</div>
        </q-card-section>
        <div class="row justify-center  q-pa-lg">
            <q-btn push color="pink" label="LET'S GO!" @click="goTime"/>
        </div>
        </q-card>
        <q-card class="text-pink-6 text-left" style="height:500px; width: 600px" v-show="isGoTime && !isCuisineDone">
            <q-card-section class="text-left">
                <div class="text-h3">CUISINES</div>
                <div class="text-h6 q-pt-md q-pb-lg">Pick your favourite Cuisines!</div>
                <q-checkbox v-for="cuisine in cuisines" :key="cuisine" :val="cuisine" v-model='cuisineSelection' :label="cuisine" color="pink" size="30px"/>
            </q-card-section>
                <div class="row justify-center  q-pa-lg">
                    <q-btn push color="pink" label="BACK TO WELCOME!" @click="goTime"/>
                    <q-separator spaced vertical color="white"/>
                    <q-btn push color="pink" label="ON TO AMBIENCE!" @click="goCuisine"/>
                </div>
        </q-card>
        <q-card class="text-pink-6 text-left" style="height:500px; width: 600px" v-show="isGoTime && isCuisineDone && !isAmbienceDone">
            <q-card-section class="text-left">
                <div class="text-h3">AMBIENCES</div>
                <div class="text-h6 q-pt-md q-pb-lg">What are your preferences!</div>
                <q-checkbox v-for="ambience in ambiences" :key="ambience" :val="ambience" v-model='ambienceSelection' :label="ambience" color="pink"/>
            </q-card-section>
                <div class="row justify-center  q-pa-lg" style="position:absolute; bottom: 30px; margin-left: 157px;">
                    <q-btn push color="pink" label="BACK TO CUISINE!" @click="goCuisine"/>
                    <q-separator spaced vertical color="white"/>
                    <q-btn push color="pink" label="DONE!" @click="completeSetup"/>
                </div>
        </q-card>
    </q-page>
</template>

<script>
import cuisines from '../restaurant_data/restaurantCuisines.json';
import cIndex from '../restaurant_data/cuisine2index.json';
import ambiences from '../restaurant_data/restaurantAmbiences.json';
import aIndex from '../restaurant_data/ambience2index.json';


export default {
    data() {
        return {
            isNew: false,
            welcomeText1: 'We are so glad that you are beginning this journey to discover the many restaurants and cuisines that Singapore has to offer',
            welcomeText2: "Before we get started on recommending a whole range of restaurants you didn't even knew you liked, help us get to know you better by selecting your preferences!",
            welcomeText3: "Don't worry, you can always change up your preferences later if you're craving something else!",
            isGoTime: false,
            isCuisineDone: false,
            isAmbienceDone:false,
            cuisines,
            cIndex,
            ambiences,
            aIndex,
            cuisineSelection: [],
            ambienceSelection: [],
            cuisineSelectionIndexed: [],
            ambienceSelectionIndexed: [],
        }
    },
    methods: {
        goTime() {
            this.isGoTime = !this.isGoTime
        },
        goCuisine() {
            this.isCuisineDone = !this.isCuisineDone
        },
        async completeSetup() {
            const tempC = new Array(49).fill(0)
            const tempA = new Array(12).fill(0)
            this.ambienceSelectionIndexed = this.ambienceSelection.map(x => aIndex[x])
            this.cuisineSelectionIndexed = this.cuisineSelection.map(x => cIndex[x])
            for (let i=0; i < this.ambienceSelectionIndexed.length; i++) {
                tempA[this.ambienceSelectionIndexed[i]] = 1
            }
            for (let i=0; i < this.cuisineSelectionIndexed.length; i++) {
                tempC[this.cuisineSelectionIndexed[i]] = 1
            }
            await this.$fb.firestore().collection('users').doc(this.$fb.auth().currentUser.uid).update({
                cuisinecount: tempC,
                ambiencecount: tempA,
                cuisinePreferences: this.cuisineSelection,
                ambiencePreferences: this.ambienceSelection,
                isNew: false
            }).then((res) => {
                this.$router.push('/')
            }).catch((error) => {
                this.$q.notify(error.message)
            })
        },
    },
    created() {
        if (!this.$fb.auth().currentUser) {
            this.$router.push('/login')
        } else {
            this.$fb.firestore().collection('users').doc(this.$fb.auth().currentUser.uid).get().then((snapshot) => {
                this.isNew = snapshot.data().isNew
                if (!this.isNew) {
                    this.$router.push('/')
                }
            }).catch((error) => {
                console.log(error.message)
            })
        }
    }
}
</script>

<style lang='scss'>
    .background
    {
        background-color: beige;
        background-image: url('../assets/background.png');
        background-size: cover;
    }
</style>
