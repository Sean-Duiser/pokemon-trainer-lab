import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Lobby', component: () => import('../features/lobby/Lobby.vue'), meta: { title: 'Trainer Lab — Lobby' } },
  { path: '/dex', name: 'Dex', component: () => import('../features/dex/DexRoom.vue'), meta: { title: 'Pokédex Room' } },
  { path: '/teams', name: 'Teams', component: () => import('../features/teams/TeamRoom.vue'), meta: { title: 'Team Room' } },
  { path: '/games', name: 'Games', component: () => import('../features/games/TrainingZone.vue'), meta: { title: 'Training Zone' } },
  { path: '/battle', name: 'Battle', component: () => import('../features/battle/BattleChamber.vue'), meta: { title: 'Battle Chamber' } },
  { path: '/tcg', name: 'TCG', component: () => import('../features/tcg/CardArchive.vue'), meta: { title: 'Card Archive' } },
  { path: '/profile', name: 'Profile', component: () => import('../features/profile/ResearchOffice.vue'), meta: { title: 'Research Office' } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../features/misc/NotFound.vue'), meta: { title: 'Not Found' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

router.afterEach((to) => {
  if (to.meta?.title) document.title = String(to.meta.title);
});

export default router;
