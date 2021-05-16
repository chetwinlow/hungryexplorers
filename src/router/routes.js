const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/homepage.vue') },
      { path: '/profile', component: () => import('pages/profilepage.vue') },
      { path: '/quickstart', component: () => import('pages/quickstartpage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
