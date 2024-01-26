const LargeLibrary = () => import('large-library');
const compression = require('compression');
import fs from 'fs';
import path from 'path';

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  experimental: {
    watcher: "chokidar",
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    https: process.env.NODE_ENV === 'production' ? {
      key: fs.readFileSync(path.resolve('C:/riset-pwa/ssl/private.key')),
      cert: fs.readFileSync(path.resolve('C:/riset-pwa/ssl/certificate.crt')),
      ca: fs.readFileSync(path.resolve('C:/riset-pwa/ssl/ca_bundle.crt')),
    } : null,
  },

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
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  css: [
    '~/assets/css/style.css'
  ],

  plugins: [
    '~/store/plugins/cache.js',
  ],

  components: true,

  buildModules: [
    "@nuxtjs/pwa",
    '@nuxt/http',
    '@nuxtjs/proxy',
    'bootstrap-vue/nuxt',
    '@nuxt/image',
    '@nuxtjs/workbox'
  ],

  modules: [
    'bootstrap-vue/nuxt',
    "@nuxtjs/pwa",
    '@nuxt/http',
    '@nuxtjs/proxy',
    '@nuxt/image',
    '@makkarpov/nuxt-service-worker',
    '@nuxtjs/workbox'
  ],

  serviceWorker: {
    entryPoint: 'sw.js'
  },

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
    compress: true,
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
      display: 'fullscreen',
      start_url: "/",
    },
    icon: {
      source: "static/icons",
      fileName: "icon.png",
    },
    workbox: {
      swSrc: 'sw.js',
      offlineStrategy: 'StaleWhileRevalidate',
      runtimeCaching: [
        {
          urlPattern: '^https://cloud.interactive.co.id/myprofit', // Customize the URL pattern
          handler: 'NetworkFirst', // Use NetworkFirst strategy for API requests
        },
      ],
    },
  },

  build: {
    transpile: ['axios', '@nuxt/image'],
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true,
    },
    terser: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    babel: {
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
      ],
    },
    externals: {
      'large-library': 'LargeLibrary',
    },
  },

  render: {
    http2: {
      push: true,
    },
    compressor: false, // Menonaktifkan kompresi Nuxt.js
  },

  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },

  // workbox: {
  //   cachingExtensions: 'sw.js'
  // },

  // generates dynamic routes
  generate: {
    fallback: true,
  },

  router: {
    middleware: [
      'index',
      'loadCart',
    ],
  },

  image: {
    domains: ['https://myprofit.interactiveholic.net'],

    // Specify default image sizes
    sizes: [320, 480, 720],

    // Specify default image loader
    loader: 'default',

    // Specify presets for image processing
    presets: {
      // Example preset for JPEG images
      myPreset: {
        modifiers: {
          format: 'webp', // Convert to WebP format
          quality: 80      // Set quality to 80
        }
      }
    },

    serverMiddleware: [
      '~/serverMiddleware/compression.js',
      compression(),
    ],
    
    scripts: {
      "build": "NODE_OPTIONS=--max_old_space_size=4096 nuxt build"
    }
  }
}
