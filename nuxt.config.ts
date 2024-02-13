// https://nuxt.com/docs/api/configuration/nuxt-config
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs';
import path from 'path';

export default defineNuxtConfig({
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

  scripts: {
    build: "nuxt build",
    dev: "nuxt dev --port=3000", // here
    generate: "nuxt generate",
    preview: "nuxt preview"
  },
  devDependencies: {
    "nuxt": "3.0.0-rc.1"
  },

  target: "static",

  ssr: true,

  devtools: { enabled: true },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-delay-hydration',
    '@nuxtjs/web-vitals'
  ],

  delayHydration: {
    debug: process.env.NODE_ENV === 'development'
  },

  webVitals: {
    debug: false,
    disabled: false
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config',
    exposeConfig: false,
    exposeLevel: 2,
    config: {},
    injectPosition: 'first',
    viewer: true,
  },

  image: {
    inject: true,
    quality: 80,
    format: ['webp']
  },

  vite: {
    server: {
      https: {
        key: fs.readFileSync(path.resolve('./ssl/private.key')),
        cert: fs.readFileSync(path.resolve('./ssl/certificate.crt')),
        ca: fs.readFileSync(path.resolve('./ssl/ca_bundle.crt')),
      },
      hmr: {
        port: 3000,
        clientPort: 3000,
        host: '0.0.0.0',
      }
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate', //change to prompt when production
        devOptions: {
          enabled: true
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Riset PWA',
          short_name: 'RPWA',
          description: 'My Awesome App description',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/icon.png', // Adjust the filenames here
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        }
      })
    ]
  }
})

