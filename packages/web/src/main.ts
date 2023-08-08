import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/graphql/client'
import { registerSharedComponents } from '@/plugins/register'
import { loadSprites } from '@/plugins/loadSvg'

// import '@/plugins/toast'
import { registerTippy } from '@/plugins/tippy'
import 'quill/dist/quill.snow.css'
import '@/main.scss'

// svg loading
loadSprites()

const app = createApp(App)

registerSharedComponents(app)

// is a complete tooltip, popover, dropdown, and menu solution for the web
registerTippy(app)

app.provide(DefaultApolloClient, apolloClient)
app.use(router)

app.mount('#app')
