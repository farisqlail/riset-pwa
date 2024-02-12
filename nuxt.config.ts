// https://nuxt.com/docs/api/configuration/nuxt-config
import { VitePWA } from 'vite-plugin-pwa'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],

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
          name: 'My Awesome App',
          short_name: 'MyApp',
          description: 'My Awesome App description',
          theme_color: '#ffffff',
          icons: [
            {
              src: './public/icon.png', // Adjust the filenames here
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: './public/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: './public/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: './public/icon.png', // Adjust the filenames here
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

