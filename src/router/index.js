import { createRouter, createWebHashHistory } from "vue-router"
// import home from "../components/home.vue"
import SellerPage from "../view/SellerPage.vue";
import Trend from "../view/TrendPage.vue";
const routes = [
    {
        path: '/',
        component: SellerPage       
    },
    {
      path: '/Trend',
      name:'Trend',
      component: Trend       
  },
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
