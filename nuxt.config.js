export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: "static",
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/pwa",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    "@nuxtjs/pwa",
  ],

  pwa: {
    // https://pwa.nuxtjs.org/manifest
    // Manifest adds Web App Manifest with no pain.
    manifest: {
      name: "RisetPWA",
      short_name: "RPWA",
      description: "Riset for PWA",
      theme_color: "#6a5acd",
      lang: "en",
      background_color: "#6a5acd",
    },
    // https://pwa.nuxtjs.org/icon
    icon: false,
    // https://pwa.nuxtjs.org/meta
    // Meta easily adds common meta tags into your project with zero-config needed. 
    meta: {
      name: "Riset PWA",
      description: "Riset for PWA",
      author: "faris",
      theme_color: "#6a5acd",
      nativeUi: true,
      appleStatusBarStyle: "black",
      mobileAppIOS: true,
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
