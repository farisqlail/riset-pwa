import path from 'path'
import fs from 'fs'
import guides from "./contents/guides/guides.js"
const certPath = path.resolve(__dirname, 'server.crt');
const keyPath = path.resolve(__dirname, 'server.key');

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: "static",

  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    }
  },

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
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/store/plugins/cache.js',
     { src: '~/store/plugins/vue-html-to-paper.js', ssr: false },
     { src: '~/store/plugins/workbox-sync.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // '@nuxtjs/tailwindcss'
    "@nuxtjs/pwa",
    'bootstrap-vue/nuxt',
  ],

  snipcart: {
    publicApiKey: "ODQ1Y2E1MmItOGVkNi00NzliLWIyMGItNWZlYjIzOTBkZGEwNjM4NDAyODU0MTUzODUwNzkw"
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    "@nuxtjs/pwa",
    '@nuxtjs/snipcart',
  ],

  pwa: {
    // https://pwa.nuxtjs.org/manifest
    // Manifest adds Web App Manifest with no pain.
    manifest: {
      name: "RisetPWA",
      short_name: "RPWA",
      description: "Riset for PWA",
      lang: "en",
      display: 'standalone',
    },
    icon: {
      source: "static/icons",  // Path to the folder containing your icon files
      fileName: "icon.png",   // The main icon file to be used
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        include: path.resolve(__dirname, 'contents'),
      })
    },
    loaders: {
      mie: 'raw-loader', // Adjust the loader based on the file type
    },
    transpile: ['axios'],
  },

  workbox: {
    runtimeCaching: [
      {
        urlPattern: 'https://localhost:3000/.*',
        handler: 'staleWhileRevalidate',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      },
      {
        urlPattern: 'https://localhost:3000/.*',
        handler: 'networkFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      },
      {
        urlPattern: 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      }
    ],
    cachingExtensions: '@/store/plugins/workbox-sync.js'
  },
  // generates dynamic routes
  generate: {
    fallback: true,
    routes: [].concat(guides.map(guide => `guides/${guide}`))
  },

  router: {
    middleware: [
      'index',
      'loadCart',
    ]
  },
}
