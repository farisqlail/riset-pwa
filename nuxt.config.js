import path from 'path'
import fs from 'fs'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: "static",

  ssr: true,

  mode: 'universal',

  head: {
    title: 'riset-pwa',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.snipcart.com/themes/v3.2.1/default/snipcart.css' },
      { rel: 'preload' }
    ],
  },

  css: [
  ],

  plugins: [
    '~/store/plugins/cache.js',
    { src: '~/store/plugins/vue-html-to-paper.js', ssr: false },
    { src: '~/store/plugins/workbox-sync.js', ssr: false },
  ],

  components: true,

  buildModules: [
    "@nuxtjs/pwa",
    '@nuxt/http',
    '@nuxtjs/proxy',
    'bootstrap-vue/nuxt',
    '@nuxt/image',
  ],

  snipcart: {
    publicApiKey: "ODQ1Y2E1MmItOGVkNi00NzliLWIyMGItNWZlYjIzOTBkZGEwNjM4NDAyODU0MTUzODUwNzkw"
  },

  modules: [
    'bootstrap-vue/nuxt',
    "@nuxtjs/pwa",
    '@nuxtjs/snipcart',
    '@nuxt/http',
    '@nuxtjs/proxy',
    '@nuxt/image',
  ],

  axios: {
    baseURL: 'https://cloud.interactive.co.id/myprofit', // Adjust the port if needed
    debug: true,
    proxy: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  },

  http: {
    baseURL: 'https://cloud.interactive.co.id/myprofit', // Replace with your Laravel app's base URL
  },

  proxy: {
    '/api/': {
      target: 'https://cloud.interactive.co.id/myprofit',
      pathRewrite: { '^/api/': '' },
      changeOrigin: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    },
  },

  pwa: {
    manifest: {
      name: "RisetPWA",
      short_name: "RPWA",
      description: "Riset for PWA",
      lang: "en",
      display: 'standalone',
    },
    icon: {
      source: "static/icons", 
      fileName: "icon.png",   
    },
  },

  build: {
    transpile: ['axios', '@nuxt/image'],
  },

  workbox: {
    cachingExtensions: '@/store/plugins/workbox-sync.js'
  },
  // generates dynamic routes
  generate: {
    fallback: true,
  },

  router: {
    middleware: [
      'index',
      'loadCart',
    ]
  },
}
