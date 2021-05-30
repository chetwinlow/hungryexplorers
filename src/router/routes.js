const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/homepage.vue') },
      { path: '/profile', component: () => import('pages/profilepage.vue') },
      { path: '/search', component: () => import('src/pages/search.vue') },
      { path: '/camera', component: () => import('src/pages/camera.vue') },
      { path: '/feed', component: () => import('src/pages/feed.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/login',
    component: () => import('layouts/loginLayout.vue'),
    children: [
      { path: '/login', component: () => import('src/pages/loginpage.vue') },
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
