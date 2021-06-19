import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';
import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore"
import 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
  apiKey: "AIzaSyDD9R_vDIugqPppEiViL3MJr32dyf1hQsk",
  authDomain: "hungry-explorers.firebaseapp.com",
  projectId: "hungry-explorers",
  storageBucket: "hungry-explorers.appspot.com",
  messagingSenderId: "1047572312694",
  appId: "1:1047572312694:web:63683e79d230e119f3e557",
  measurementId: "G-PWCJH47LLR"
};
// Initialize Firebase

Vue.use(VueRouter);

Vue.prototype.$fb = firebase.initializeApp(firebaseConfig);
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.auth().languageCode = 'en';
googleProvider.setCustomParameters({
  'login_hint': 'user@example.com'
});
Vue.prototype.$googleProvider = googleProvider
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  return Router;
}
