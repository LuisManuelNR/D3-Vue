import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VSlider,
  VTooltip,
  VCheckbox,
  VSnackbar,
  transitions
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VSlider,
    VTooltip,
    VCheckbox,
    VSnackbar,
    transitions
  }
})

Vue.config.productionTip = false

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('service-worker.js', {
      scope: './'
    }).then(registration => {
      if (typeof registration.update === 'function') {
        registration.update()
      }
      registration.onupdatefound = () => {
        var installingWorker = registration.installing

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                store.commit('notification', {
                  activo: true,
                  text: 'New or updated content is available.',
                  timeout: null,
                  color: 'blue',
                  btnText: 'reload'
                })
                console.log('New or updated content is available.')
              } else {
                store.commit('notification', {
                  activo: true,
                  text: 'Content available for offline use.',
                  timeout: 6000,
                  color: 'blue',
                  btnText: 'close'
                })
                console.log('Content is cached, and will be available for offline use the ' +
                            'next time the page is loaded.')
              }
              break

            case 'redundant':
              console.error('The installing service worker became redundant.')
              break
          }
        }
      }
    }).catch(e => {
      console.error('Error during service worker registration:', e)
    })
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
