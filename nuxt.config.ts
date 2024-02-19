// https://nuxt.com/docs/api/configuration/nuxt-config
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs';
import path from 'path';

export default defineNuxtConfig({

  devServer: {
    https: {
      key: './ssl/private.key',
      cert: './ssl/certificate.crt'
    }
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/certificate.crt')),
      ca: fs.readFileSync(path.resolve(__dirname, 'ssl/ca_bundle.crt')),
    },
  },

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
        registerType: 'autoUpdate', // Change to 'prompt' when in production
        devOptions: {
          enabled: false,
          navigateFallbackAllowlist: [/^\/$/],
          type: 'module',
        },
        workbox: {
          navigateFallback: "/", // Fallback to index.html
          globPatterns: [
            "**/*.{js,css,html,png,jpg,jpeg,svg,woff2,woff,ttf,eot,webmanifest}",
          ],
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
              type: 'image/png',
            },
            {
              src: '/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon.png', // Adjust the filenames here
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],

  }
})

