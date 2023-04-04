import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/global.less'
import './assets/font/iconfont.css'
const app = createApp(App);
app.use(router)
// app.config.globalProperties.$echarts = window.echarts
app.mount('#app')
