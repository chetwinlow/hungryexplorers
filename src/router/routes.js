const routes = [
  {
    path: '/login',
    component: () => import('layouts/loginLayout.vue'),
    children: [
      { path: '/login', component: () => import('src/pages/loginpage.vue') },
      { path: '/register', component: () => import('pages/register.vue') },
      { path: '/newUserSetup', component: () => import('pages/newUserSetupPage.vue') },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/newMain.vue'),
    children: [
      { path: '', component: () => import('src/pages/dailies.vue') },
      { path: '/profile/:id', component: () => import('pages/profilepage.vue') },
      { path: '/restaurants', component: () => import('src/pages/restaurants.vue') },
      { path: '/restaurants/:id', component: () => import('src/pages/restaurant_profile.vue') },
      { path: '/createReview', component: () => import('src/pages/createReview.vue') },
      { path: '/feed', component: () => import('src/pages/feed.vue') },
    ],
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
