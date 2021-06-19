const firebase = require('firebase')

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

/*
import firebaseconfig key before use
*/
const firebaseConfig = {
  apiKey: "AIzaSyDD9R_vDIugqPppEiViL3MJr32dyf1hQsk",
  authDomain: "hungry-explorers.firebaseapp.com",
  projectId: "hungry-explorers",
  storageBucket: "hungry-explorers.appspot.com",
  messagingSenderId: "1047572312694",
  appId: "1:1047572312694:web:63683e79d230e119f3e557",
  measurementId: "G-PWCJH47LLR"
};

const fb = firebase.initializeApp(firebaseConfig);
const fs = require('fs')

// const data = JSON.parse(fs.readFileSync('./restaurant_data/final_chope_data.txt', 'utf8'))
// const db = []

// const num = data['title'].length
// for (let i = 0; i < num; i++) {
//     let temp = {
//         'title': '',
//         'Cuisine': '',
//        'Menus': '',
//         'Hours': '',
//         'Price': '',
//         'Good For': '',
//         'Location': '',
//         'Address': '',
//         'Address Link': '',
//         'DISHES WE LOVE': '',
//         'ABOUT': '',
//         'PRESS RELEASE': '',
//         'images': []
//     }
//     for (let j in temp){
//         if (j == 'images') {
//             if (temp['title'] == imgbank['title'][i]) {
//                 temp[j] = imgbank['imgarr'][i];
//                 imgbank['imgarr'][i] = 0
//             } else {
//                 console.log(str(i))
//             }
//         } else {
//             temp[j] = data[j][i]
//         }
//     }
//     db.push(temp)
// }

// function fswriting(i) {
//     fb.firestore().collection('restaurants').doc().set({
//         'title': db[i]['title'],
//         'Cuisine': db[i]['Cuisine'],
//     'Menus': db[i]['Menus'],
//         'Hours': db[i]['Hours'],
//         'Price': db[i]['Price'],
//         'Good For': db[i]['Good For'],
//         'Location': db[i]['Location'],
//         'Address': db[i]['Address'],
//         'Address Link': db[i]['Address Link'],
//         'DISHES WE LOVE': db[i]['DISHES WE LOVE'],
//         'ABOUT': db[i]['ABOUT'],
//         'PRESS RELEASE': db[i]['PRESS RELEASE'],
//         'totalRating': 0,
//         'reviewCount': 0,
//         'reviews': [],
//     }).then((res) => {
//         console.log(i)
//     }).catch((err) => {
//         console.log("error at " + i)
//     })
// }

function imgupdate (i) {
  fb.firestore().collection('restaurants').where("title", "==", temp['title'][i]).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.update({
        images: temp['imgarr'][i]
      }).then((res) => {
        temp['imgarr'][i] = 0
        console.log(i)
      })
    })
  })
}

for (i = 0; i < 1499; i++) {
  setTimeout(imgupdate, 1100, i)
}

// fb.firestore().collection("restaurants").get().then(function(querySnapshot) {
//     console.log(querySnapshot.size);
// });

// console.log(check.length)

// fs.writeFileSync('./restaurant_data/fullRestaurant.json', JSON.stringify(db))

// fs.writeFileSync('./restaurant_data/full_restaurants.json', JSON.stringify(db))

for (let i = 0; i < temp['imgarr'].length; i++) {
  if (temp['imgarr'][i] != 0) {
    console.log(i)
  }
}
