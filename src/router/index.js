import { createRouter, createWebHashHistory } from "vue-router"
// import home from "../components/home.vue"
import home from "../view/ScreenPage.vue"
import SellerPage from "../view/SellerPage.vue";
import Trend from "../view/TrendPage.vue";
import Map from "../view/MapPage.vue";
import Rank from '../view/RankPage.vue';
import Hot from '../view/HotPage.vue';
import Stock from '../view/StockPage.vue';
const routes = [
  {
    path: '/',
    component: home
  },
  {
    path: '/SellerPage',
    name: 'SellerPage',
    component: SellerPage
  },
  {
    path: '/Trend',
    name: 'Trend',
    component: Trend
  },
  {
    path: '/Map',
    name: 'Map',
    component: Map
  },
  {
    path: '/Rank',
    name: 'Rank',
    component: Rank
  },
  {
    path: '/Hot',
    name: 'Hot',
    component: Hot
  },
  {
    path: '/Stock',
    name: 'Stock',
    component: Stock
  },
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
