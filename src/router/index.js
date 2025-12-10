import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Bestiary from '../views/Bestiary.vue'
import Dashboard from '../views/Dashboard.vue'
import Reliquary from '../views/Reliquary.vue'
import Missions from '../views/Missions.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bestiary',
    name: 'Bestiary',
    component: Bestiary
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/reliquary',
    name: 'Reliquary',
    component: Reliquary
  },
  {
    path: '/missions',
    name: 'Missions',
    component: Missions
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
