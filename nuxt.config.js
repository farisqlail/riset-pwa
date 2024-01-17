const LargeLibrary = () => import('large-library');
const compression = require('compression');

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
    ],
  },

  css: [
    '~/assets/css/style.css'
  ],

  plugins: [
    '~/store/plugins/cache.js',
    { src: '~/store/plugins/workbox-sync.js', ssr: true },
  ],

  components: true,

  buildModules: [
    "@nuxtjs/pwa",
    '@nuxt/http',
    '@nuxtjs/proxy',
    'bootstrap-vue/nuxt',
    '@nuxt/image',
  ],

  modules: [
    'bootstrap-vue/nuxt',
    "@nuxtjs/pwa",
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
      display: 'standalone',
    },
    icon: {
      source: "static/icons",
      fileName: "icon.png",
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

    render: {
      http2: {
        push: true,
      },
      compressor: false, // Menonaktifkan kompresi Nuxt.js
    },
  }
}
