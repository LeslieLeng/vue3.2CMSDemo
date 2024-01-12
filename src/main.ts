import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from './router/router'
import App from './App.vue'

import persist from 'pinia-plugin-persistedstate'
import { createPinia } from "pinia";
import * as Icons from '@ant-design/icons-vue'
const pinia = createPinia().use(persist);


const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Antd)


// 全局使用图标，遍历引入
const icons: any = Icons
for (const i in icons) {
    app.component(i, icons[i])
}
app.mount('#app')
