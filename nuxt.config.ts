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

  server: {
    host: '0.0.0.0',
    port: 3000,
    https: process.env.NODE_ENV === 'production' ? {
      key: fs.readFileSync(path.resolve('C:/riset-pwa/ssl/private.key')),
      cert: fs.readFileSync(path.resolve('C:/riset-pwa/ssl/certificate.crt')),
      ca: fs.readFileSync(path.resolve('C:/riset-pwa/ssl/ca_bundle.crt')),
    } : null,
  },

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

