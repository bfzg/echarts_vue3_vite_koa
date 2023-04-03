import { createRouter, createWebHashHistory } from "vue-router"
// import home from "../components/home.vue"
import SellerPage from "../view/SellerPage.vue";
const routes = [
    {
        path: '/',
        component: SellerPage       
    },
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
