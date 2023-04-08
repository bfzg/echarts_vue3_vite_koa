import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/global.less'
import './assets/font/iconfont.css'
import SocketService from './utils/socket_service'
SocketService.Instance.connect()
const app = createApp(App);
app.config.globalProperties.$socket = SocketService.Instance
app.use(router)
// app.config.globalProperties.$echarts = window.echarts
app.mount('#app')
