import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
/*
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { onError } from "apollo-link-error"
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { provide } from '@vue/composition-api'
import { ApolloClients } from '@vue/apollo-composable'

const httpLink = new HttpLink({
    //uri: process.env.VUE_APP_GRAPHQL_ENDPOINT
    uri: 'http://localhost:8080/msbt_admin/cid/api/forms.php'
})

// Error Handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        )
    if (networkError) console.log(`[Network error]: ${networkError}`)
})

// Create the apollo client
export const apolloClient = new ApolloClient({
    link: errorLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true
})

// Install the Vue plugin
Vue.use(VueApollo)
*/
/*
export const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})
*/

Vue.config.productionTip = false

new Vue({
  /*
  setup () {
    provide(ApolloClients, {
      default: apolloClient,
    })
  },
*/
  router,
  store,
  render: h => h(App)
}).$mount('#app')
