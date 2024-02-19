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

  pwa: {
    /* PWA options */
    manifest: {
      name: "My Nuxt PWA",
      short_name: "Nuxt PWA",
      description: "My Awesome Nuxt PWA",
      theme_color: "#0AB85F",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/", // Fallback to index.html
      globPatterns: [
        "**/*.{js,css,html,png,jpg,jpeg,svg,woff2,woff,ttf,eot,webmanifest}",
      ],
    },
    client: {
      installPrompt: true,
    },
    registerWebManifestInRouteRules: true,
    devOptions: {
      enabled: true,
      navigateFallbackAllowlist: [/^\/$/],
    },
    registerType: "autoUpdate",
  },
})

